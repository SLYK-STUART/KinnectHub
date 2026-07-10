from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Profile
from .permissions import ProfilePermission
from .serializers import (
    ProfileSerializer,
    ProfileUpdateSerializer,
    ProfileListSerializer,
)


class ProfileListView(generics.ListAPIView):
    """All family members' basic profile cards."""
    queryset = Profile.objects.select_related('member').all()
    serializer_class = ProfileListSerializer
    permission_classes = [IsAuthenticated]


class MyProfileView(APIView):
    """Shortcut for the logged-in user's own profile — no need to know their Profile id."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.profile  # OneToOneField related_name='profile'
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)


class ProfileDetailView(generics.RetrieveAPIView):
    """Full profile for any family member, by Profile id."""
    queryset = Profile.objects.select_related('member').all()
    serializer_class = ProfileSerializer
    permission_classes = [ProfilePermission]


class ProfileUpdateView(generics.UpdateAPIView):
    """Edit a profile — only the owner or an admin (enforced by ProfilePermission)."""
    queryset = Profile.objects.all()
    serializer_class = ProfileUpdateSerializer
    permission_classes = [ProfilePermission]