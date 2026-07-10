from django.utils.timezone import now
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

from core.utils import get_user_family

from .models import LocationShare, SOSAlert
from .permissions import IsSOSOwnerOrAdmin, IsLocationShareOwner
from .serializers import (
    LocationShareSerializer,
    LocationShareCreateSerializer,
    SOSAlertSerializer,
    SOSAlertCreateSerializer,
    SOSAlertUpdateSerializer,
    SafetyResponseCreateSerializer,
)


# ====================== LOCATION SHARE ======================

class LocationShareListView(generics.ListAPIView):
    """Active, non-expired location shares for the logged-in user's family."""
    serializer_class = LocationShareSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        family = get_user_family(self.request.user)
        return (
            LocationShare.objects
            .filter(family=family, is_active=True)
            .filter(Q(expires_at__isnull=True) | Q(expires_at__gt=now()))
            .select_related('shared_by')
        )


class LocationShareCreateView(generics.CreateAPIView):
    queryset = LocationShare.objects.all()
    serializer_class = LocationShareCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        LocationShare.objects.filter(shared_by=user, is_active=True).update(is_active=False)
        serializer.save(shared_by=user, family=get_user_family(user))


class LocationShareDeactivateView(APIView):
    """POST to stop sharing your location early."""
    permission_classes = [IsAuthenticated, IsLocationShareOwner]

    def post(self, request, pk):
        try:
            share = LocationShare.objects.get(pk=pk)
        except LocationShare.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, share)
        share.is_active = False
        share.save(update_fields=['is_active'])
        return Response({"detail": "Location sharing stopped."})


# ====================== SOS ALERT ======================

class SOSAlertListView(generics.ListAPIView):
    """All SOS alerts for the family — supports ?status=active filter."""
    serializer_class = SOSAlertSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        family = get_user_family(self.request.user)
        queryset = (
            SOSAlert.objects
            .filter(family=family)
            .select_related('triggered_by', 'resolved_by')
            .prefetch_related('responses__responded_by')
        )

        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        return queryset


class SOSAlertCreateView(generics.CreateAPIView):
    queryset = SOSAlert.objects.all()
    serializer_class = SOSAlertCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(triggered_by=user, family=get_user_family(user), status='active')


class SOSAlertResolveView(generics.UpdateAPIView):
    """PATCH status to 'resolved' or 'cancelled'."""
    queryset = SOSAlert.objects.all()
    serializer_class = SOSAlertUpdateSerializer
    permission_classes = [IsAuthenticated, IsSOSOwnerOrAdmin]

    def perform_update(self, serializer):
        new_status = serializer.validated_data.get('status')
        if new_status in ('resolved', 'cancelled'):
            serializer.save(resolved_by=self.request.user, resolved_at=now())
        else:
            serializer.save()


class SafetyResponseCreateView(generics.CreateAPIView):
    """POST an 'I'm Safe' response to a specific SOS alert."""
    serializer_class = SafetyResponseCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        try:
            alert = SOSAlert.objects.get(pk=self.kwargs['sos_id'])
        except SOSAlert.DoesNotExist:
            raise NotFound("SOS alert not found.")
        serializer.save(responded_by=self.request.user, sos_alert=alert)