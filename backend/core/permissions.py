from rest_framework import permissions
from rest_framework.permissions import BasePermission


class IsAdminOrReadOnly(BasePermission):
    """
    Allows read-only access to everyone, 
    but only Admin can perform write operations.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_admin


class IsFamilyAdmin(BasePermission):
    """
    Only Family Admin can perform this action
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_admin


class IsOwnerOrAdmin(BasePermission):
    """
    Flexible permission: Owner or Admin.
    Works with different field names: 'author', 'member', 'created_by'
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_admin:
            return True

        # Check common ownership fields
        owner_fields = ['member', 'author', 'created_by', 'user']
        for field in owner_fields:
            if hasattr(obj, field):
                owner = getattr(obj, field)
                if owner == request.user:
                    return True
        return False


class IsProfileOwnerOrAdmin(BasePermission):
    """
    Specifically for Profile model (uses 'member' field)
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_admin:
            return True
        return obj.member == request.user


class CanViewSensitiveInfo(BasePermission):
    """
    Controls access to sensitive data (NIN, medical info, etc.)
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_admin:
            return True
        # Users can see their own sensitive information
        return hasattr(obj, 'member') and obj.member == request.user