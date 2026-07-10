from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound

from core.utils import get_user_family

from .models import VaultCategory, VaultDocument
from .permissions import user_can_access_category, IsCategoryCreatorOrAdmin
from .utils import generate_vault_token
from .serializers import (
    VaultCategorySerializer,
    VaultCategoryCreateSerializer,
    VaultCategorySetPasscodeSerializer,
    VaultCategoryUnlockSerializer,
    VaultDocumentListSerializer,
    VaultDocumentDetailSerializer,
    VaultDocumentCreateSerializer,
    VaultDocumentUpdateSerializer,
)


def _get_category_or_404(category_id):
    try:
        return VaultCategory.objects.get(pk=category_id)
    except VaultCategory.DoesNotExist:
        raise NotFound("Vault category not found.")


# ====================== CATEGORIES ======================

class VaultCategoryListView(generics.ListAPIView):
    serializer_class = VaultCategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        family = get_user_family(self.request.user)
        return VaultCategory.objects.filter(family=family).select_related('created_by')


class VaultCategoryCreateView(generics.CreateAPIView):
    queryset = VaultCategory.objects.all()
    serializer_class = VaultCategoryCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(family=get_user_family(user), created_by=user)


class VaultCategoryDeleteView(generics.DestroyAPIView):
    queryset = VaultCategory.objects.all()
    permission_classes = [IsAuthenticated, IsCategoryCreatorOrAdmin]


class VaultCategorySetPasscodeView(APIView):
    """Creator or admin sets/changes/removes the passcode lock."""
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        category = _get_category_or_404(pk)

        if not (request.user.is_admin or category.created_by == request.user):
            raise PermissionDenied("Only the creator or an admin can change the passcode.")

        serializer = VaultCategorySetPasscodeSerializer(
            data=request.data, context={'category': category}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"detail": "Passcode updated.", "is_locked": category.is_locked})


class VaultCategoryUnlockView(APIView):
    """
    POST { "passcode": "1234" } → returns a short-lived vault_token
    to send as the 'X-Vault-Token' header on subsequent document requests.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        category = _get_category_or_404(pk)
        serializer = VaultCategoryUnlockSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not category.check_passcode(serializer.validated_data['passcode']):
            return Response({"detail": "Incorrect passcode."}, status=status.HTTP_403_FORBIDDEN)

        token = generate_vault_token(request.user.id, category.id)
        return Response({"vault_token": token, "expires_in": 900})


# ====================== DOCUMENTS ======================

class VaultDocumentListView(generics.ListAPIView):
    """GET /api/vault/documents/?category=<uuid>"""
    serializer_class = VaultDocumentListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        category_id = self.request.query_params.get('category')
        if not category_id:
            raise NotFound("category query parameter is required.")

        category = _get_category_or_404(category_id)

        if not user_can_access_category(self.request, category):
            raise PermissionDenied("This category is locked. Submit the correct passcode to unlock it.")

        return VaultDocument.objects.filter(category=category).select_related('uploaded_by')


class VaultDocumentDetailView(generics.RetrieveAPIView):
    queryset = VaultDocument.objects.select_related('category', 'uploaded_by').all()
    serializer_class = VaultDocumentDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        document = super().get_object()
        if not user_can_access_category(self.request, document.category):
            raise PermissionDenied("This category is locked. Submit the correct passcode to unlock it.")
        return document


class VaultDocumentCreateView(generics.CreateAPIView):
    queryset = VaultDocument.objects.all()
    serializer_class = VaultDocumentCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        category_id = self.request.data.get('category')
        if not category_id:
            raise NotFound("category is required.")

        category = _get_category_or_404(category_id)

        if not user_can_access_category(self.request, category):
            raise PermissionDenied("This category is locked. Submit the correct passcode to unlock it.")

        serializer.save(category=category, uploaded_by=self.request.user)


class VaultDocumentUpdateView(generics.UpdateAPIView):
    queryset = VaultDocument.objects.all()
    serializer_class = VaultDocumentUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        document = super().get_object()
        if not user_can_access_category(self.request, document.category):
            raise PermissionDenied("This category is locked. Submit the correct passcode to unlock it.")
        return document


class VaultDocumentDeleteView(generics.DestroyAPIView):
    queryset = VaultDocument.objects.all()
    permission_classes = [IsAuthenticated]

    def get_object(self):
        document = super().get_object()
        if not user_can_access_category(self.request, document.category):
            raise PermissionDenied("This category is locked. Submit the correct passcode to unlock it.")
        return document