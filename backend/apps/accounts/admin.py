from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import FamilyMember

# Register your models here.
@admin.register(FamilyMember)
class FamilyMemberAdmin(UserAdmin):
    list_display = ('full_name', 'email', 'family_role', 'is_admin', 'is_active', 'date_joined')
    list_filter = ('is_admin', 'is_active')
    search_fields = ('full_name', 'email')
    ordering = ('full_name',)

    fieldsets = (
        (None, {'fields': ('email', 'password', 'firebase_uid')}),
        ('Personal Info', {'fields': ('full_name', 'family_role', 'phone_number')}),
        ('Permissions', {'fields': ('is_admin', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Security', {'fields': ('must_change_password', 'last_password_change')}),
        ('Important dates', {'fields': ('date_joined', 'last_seen')}),
    )
    
    readonly_fields = ('date_joined', 'last_seen', 'last_password_change')

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'password1', 'password2'),
        }),
    )