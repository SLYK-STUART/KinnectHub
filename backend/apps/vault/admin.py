from django.contrib import admin
from .models import VaultCategory, VaultDocument


@admin.register(VaultCategory)
class VaultCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'custom_name', 'created_by', 'created_at')
    list_filter = ('name',)
    search_fields = ('custom_name', 'created_by__full_name')
    raw_id_fields = ('family', 'created_by')


@admin.register(VaultDocument)
class VaultDocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'uploaded_by', 'expiry_date', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('title', 'description')
    raw_id_fields = ('category', 'uploaded_by')