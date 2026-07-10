from django.db.models import Q
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .models import Announcement, Poll, PollOption
from .serializers import (
    AnnouncementCreateSerializer,
    AnnouncementDetailSerializer,
    AnnouncementListSerializer,
    AnnouncementReplyCreateSerializer,
)

class AnnouncementListView(generics.ListAPIView):
    serializer_class = AnnouncementListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Visible if it's for everyone or user is targeted
        return (
            Announcement.objects
             .filter(Q(is_for_all=True) | Q(targeted_members=user))
             .distinct()
             .select_related('author')
        )
    
class AnnouncementDetailView(generics.RetrieveAPIView):
    serializer_class = AnnouncementDetailSerializer
    permission_classes = [IsAuthenticated]
    queryset = Announcement.objects.select_related('author').prefetch_related(
        'replies__author', 'poll__options'
    )

class AnnouncementCreateView(generics.CreateAPIView):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class AnnouncementDeleteView(generics.DestroyAPIView):
    queryset = Announcement.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        user = self.request.user
        if instance.author_id != user.id and not user.is_admin:
            raise PermissionDenied("You can only delete your own announcements.")
        instance.delete()

class AnnouncementReplyCreateView(generics.CreateAPIView):
    serializer_class = AnnouncementReplyCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        announcement = Announcement.objects.get(pk=self.kwargs['announcement_id'])
        serializer.save(author=self.request.user, announcement=announcement)

class PollVoteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, poll_id):
        option_id = request.data.get('option_id')
        if not option_id:
            return Response(
                {"detail": "option_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            poll = Poll.objetcs.get(pk=poll_id)
        except Poll.DoesNotExist:
            return Response({"detail": "Poll not found."}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            option = poll.options.get(pk=option_id)
        except PollOption.DoesNotExist:
            return Response(
                {"detail": "Option not found in this poll."},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        user = request.user
        for other_option in poll.options.exclude(pk=option_id):
            other_option.votes.remove(user)
        option.votes.add(user)

        return Response({"detail": "Vote recorded."}, status=status.HTTP_200_OK)