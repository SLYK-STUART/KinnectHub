from rest_framework import permissions

class IsSOSOwnerOrAdmin(permissions.BasePermission):
    """
    Only the person who triggered an SOS, or an admin can resolve or cancel it
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_admin:
            return True
        return obj.triggered_by == request.user
    
class IsLocationShareOwner(permissions.BasePermission):
    """
    only the sharer or admin can stop a location share ealry.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_admin:
            return True
        return obj.shared_by == request.user