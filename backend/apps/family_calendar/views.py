from django.utils.timezone import now
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound

from core.utils import get_user_family
from apps.accounts.permissions import IsAdminUser

from .models import Event, EventParticipant
from .serializers import (
    EventListSerializer,
    EventDetailSerializer,
    EventCreateSerializer,
)


class EventListView(generics.ListAPIView):
    """
    GET /api/calendar/
    Optional filters: ?event_type=birthday&upcoming=true
    """
    serializer_class = EventListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        family = get_user_family(self.request.user)
        queryset = Event.objects.filter(family=family).select_related('created_by')

        event_type = self.request.query_params.get('event_type')
        if event_type:
            queryset = queryset.filter(event_type=event_type)

        upcoming = self.request.query_params.get('upcoming')
        if upcoming == 'true':
            queryset = queryset.filter(start_date__gte=now())

        return queryset


class EventDetailView(generics.RetrieveAPIView):
    serializer_class = EventDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        family = get_user_family(self.request.user)
        return Event.objects.filter(family=family).select_related(
            'created_by'
        ).prefetch_related('participants__member')


class EventCreateView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(created_by=user, family=get_user_family(user))


class EventUpdateView(generics.UpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        event = self.get_object()
        user = self.request.user
        if event.created_by != user and not user.is_admin:
            raise PermissionDenied("Only the creator or an admin can edit this event.")
        serializer.save()


class EventDeleteView(generics.DestroyAPIView):
    queryset = Event.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        user = self.request.user
        if instance.created_by != user and not user.is_admin:
            raise PermissionDenied("Only the creator or an admin can delete this event.")
        instance.delete()


class EventRSVPView(APIView):
    """
    POST /api/calendar/<uuid>/rsvp/
    Body: {"is_attending": true} or {"is_attending": false}
    Mark yourself as attending or not attending an event.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            family = get_user_family(request.user)
            event = Event.objects.get(pk=pk, family=family)
        except Event.DoesNotExist:
            raise NotFound("Event not found.")

        is_attending = request.data.get('is_attending', True)

        participant, created = EventParticipant.objects.update_or_create(
            event=event,
            member=request.user,
            defaults={'is_attending': is_attending},
        )

        return Response({
            "detail": "RSVP recorded.",
            "is_attending": participant.is_attending,
        }, status=status.HTTP_200_OK)