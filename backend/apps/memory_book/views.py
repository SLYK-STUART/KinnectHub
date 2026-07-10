from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied, NotFound
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from core.utils import get_user_family
from .models import MemoryItem, MemoryDeletionRequest
from .serializers import (
    MemoryItemListSerializer,
    MemoryItemDetailSerializer,
    MemoryItemCreateSerializer,
    MemoryDeletionRequestSerializer,
    MemoryDeletionRequestCreateSerializer,
)


class IsFamilyAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin)


# ====================== MEMORY ITEM VIEWS ======================

class MemoryItemListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['item_type', 'year', 'event_name', 'album']
    search_fields = ['title', 'description', 'event_name', 'album']
    ordering_fields = ['created_at', 'year']

    def get_queryset(self):
        return MemoryItem.objects.filter(
            family=get_user_family(self.request.user)     # ← fixed
        ).select_related('uploaded_by').prefetch_related('tagged_members')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MemoryItemCreateSerializer
        return MemoryItemListSerializer

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(
            uploaded_by=user,
            family=get_user_family(user),                 # ← fixed
        )


class MemoryItemDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = MemoryItemDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return MemoryItem.objects.filter(
            family=get_user_family(self.request.user)     # ← fixed
        ).select_related('uploaded_by').prefetch_related('tagged_members')

    def perform_destroy(self, instance):
        user = self.request.user
        if instance.uploaded_by_id != user.id and not user.is_admin:
            raise PermissionDenied(
                "Only the uploader or a family admin can delete this memory item."
            )
        instance.delete()


# ====================== DELETION REQUEST VIEWS ======================

class MemoryDeletionRequestListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']

    def get_queryset(self):
        qs = MemoryDeletionRequest.objects.filter(
            memory_item__family=get_user_family(self.request.user)  # ← fixed
        ).select_related('memory_item', 'requested_by', 'reviewed_by')

        if not self.request.user.is_admin:
            qs = qs.filter(requested_by=self.request.user)

        return qs

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MemoryDeletionRequestCreateSerializer
        return MemoryDeletionRequestSerializer

    def perform_create(self, serializer):
        memory_item_id = self.request.data.get('memory_item_id')
        if not memory_item_id:
            raise NotFound("memory_item_id is required.")

        try:
            memory_item = MemoryItem.objects.get(pk=memory_item_id)
        except MemoryItem.DoesNotExist:
            raise NotFound("Memory item not found.")

        user = self.request.user
        family = get_user_family(user)                              # ← fixed

        if memory_item.family_id != family.id:
            raise PermissionDenied(
                "You can only request deletion of items in your own family."
            )

        serializer.save(requested_by=user, memory_item=memory_item)


class MemoryDeletionRequestReviewView(APIView):
    """
    POST /api/memory/deletion-requests/<id>/review/
    Body: {"action": "approve"} or {"action": "reject"}
    Restricted to family admins.
    """
    permission_classes = [permissions.IsAuthenticated, IsFamilyAdmin]

    def post(self, request, id):
        family = get_user_family(request.user)                      # ← fixed
        try:
            deletion_request = MemoryDeletionRequest.objects.select_related(
                'memory_item'
            ).get(id=id, memory_item__family=family)
        except MemoryDeletionRequest.DoesNotExist:
            return Response(
                {"detail": "Deletion request not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if deletion_request.status != 'pending':
            return Response(
                {"detail": f"This request has already been {deletion_request.status}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        action = request.data.get('action')
        if action not in ('approve', 'reject'):
            return Response(
                {"detail": "action must be 'approve' or 'reject'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        deletion_request.reviewed_by = request.user

        if action == 'approve':
            deletion_request.status = 'approved'
            deletion_request.save(update_fields=['status', 'reviewed_by'])
            deletion_request.memory_item.delete()
        else:
            deletion_request.status = 'rejected'
            deletion_request.save(update_fields=['status', 'reviewed_by'])

        return Response(
            MemoryDeletionRequestSerializer(deletion_request).data,
            status=status.HTTP_200_OK
        )