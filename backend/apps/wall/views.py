from django.db.models import Count
from rest_framework import generics, permissions, status
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend

from core.utils import get_user_family
from .models import WallPost, WallReply
from .serializers import (
    ReactionSerializer,
    WallPostCreateSerializer,
    WallPostDetailSerializer,
    WallPostListSerializer,
    WallReplyCreateSerializer,
)


class IsAuthorOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        author = getattr(obj, 'author', None)
        return bool(request.user and request.user.is_authenticated and (request.user.is_admin or author == request.user))


class WallPostListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['post_type']
    search_fields = ['message', 'author__full_name']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return (
            WallPost.objects.filter(family=get_user_family(self.request.user))
            .select_related('author', 'family')
            .prefetch_related('replies__author')
            .annotate(reply_total=Count('replies'))
        )

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return WallPostCreateSerializer
        return WallPostListSerializer

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(author=user, family=get_user_family(user))


class WallPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            WallPost.objects.filter(family=get_user_family(self.request.user))
            .select_related('author', 'family')
            .prefetch_related('replies__author')
        )

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return WallPostCreateSerializer
        return WallPostDetailSerializer

    def perform_update(self, serializer):
        post = self.get_object()
        if post.author != self.request.user and not self.request.user.is_admin:
            raise PermissionDenied('Only the author or an admin can edit this wall post.')
        serializer.save()

    def perform_destroy(self, instance):
        if instance.author != self.request.user and not self.request.user.is_admin:
            raise PermissionDenied('Only the author or an admin can delete this wall post.')
        instance.delete()


class WallReplyCreateView(generics.CreateAPIView):
    serializer_class = WallReplyCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        try:
            post = WallPost.objects.get(pk=self.kwargs['post_id'], family=get_user_family(self.request.user))
        except WallPost.DoesNotExist:
            raise NotFound('Wall post not found.')

        serializer.save(post=post, author=self.request.user)


class WallReplyDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrAdmin]

    def get_queryset(self):
        return WallReply.objects.filter(
            post__family=get_user_family(self.request.user)
        ).select_related('author', 'post')


class WallPostReactionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def _get_post(self, pk):
        try:
            return WallPost.objects.get(pk=pk, family=get_user_family(self.request.user))
        except WallPost.DoesNotExist:
            raise NotFound('Wall post not found.')

    def post(self, request, pk):
        serializer = ReactionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        emoji = serializer.validated_data['emoji']
        post = self._get_post(pk)
        reactions = dict(post.reactions or {})
        reactions[emoji] = int(reactions.get(emoji, 0)) + 1
        post.reactions = reactions
        post.save(update_fields=['reactions', 'updated_at'])

        return Response({'reactions': post.reactions}, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        serializer = ReactionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        emoji = serializer.validated_data['emoji']
        post = self._get_post(pk)
        reactions = dict(post.reactions or {})

        if emoji in reactions:
            next_count = int(reactions[emoji]) - 1
            if next_count > 0:
                reactions[emoji] = next_count
            else:
                reactions.pop(emoji)
            post.reactions = reactions
            post.save(update_fields=['reactions', 'updated_at'])

        return Response({'reactions': post.reactions}, status=status.HTTP_200_OK)
