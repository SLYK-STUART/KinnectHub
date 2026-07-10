from rest_framework.permissions import BasePermission
from .utils import verify_vault_token

def user_can_access_category(request, category):
    """
    Admins bypass passcode locks entirely.
    Unlocked categories are open to any authenticated family member.
    Locked categories require a valid X-vault-Token header
    (obtained via the /unlock/endpoint), scoped to the user + category
    """

    user = request.user
    if user.is_admin:
        return True
    if not category.is_locked:
        return True
    
    token = request.headers.get('X_Vault_Token')
    if not token:
        return False
    return verify_vault_token(token, user.id, category.id)

class IsCategoryCreatorOrAdmin(BasePermission):
    """Only the creator or an admin, can delete/relock it"""
    def has_object_permission(self, request, view, obj):
        if request.user.is_admin:
            return True
        return obj.created_by == request.user