from rest_framework import permissions
from core.permissions import IsFamilyAdmin


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Allows users to view/edit their own profile.
    Admins can view/edit all profiles.
    """
    def has_object_permission(self, request, view, obj):
        # Admin can do anything
        if request.user.is_admin:
            return True
        
        # Owner can access their own profile
        return obj.member == request.user


class ProfilePermission(permissions.BasePermission):
    """
    Main permission class for Profile views
    """
    def has_permission(self, request, view):
        # All authenticated family members can view profiles
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Only authenticated users can modify
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True  # Anyone in the family can view any profile
        
        # For write operations (PUT, PATCH, DELETE)
        return request.user.is_admin or obj.member == request.user


class CanViewSensitiveInfo(permissions.BasePermission):
    """
    Controls access to sensitive fields like NIN, medical info, etc.
    """
    def has_object_permission(self, request, view, obj):
        # Admins can see everything
        if request.user.is_admin:
            return True
        
        # Users can see their own sensitive info
        return obj.member == request.user