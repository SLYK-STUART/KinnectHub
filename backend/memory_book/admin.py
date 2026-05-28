from django.contrib import admin
from .models import MemoryItem, MemoryDeletionRequest


@admin.register(MemoryItem)
class MemoryItemAdmin(admin.ModelAdmin):
    list_display = ('item_type', 'uploaded_by', 'event_name', 'year', 'created_at')
    list_filter = ('item_type', 'year', 'album')
    search_fields = ('title', 'description', 'uploaded_by__full_name', 'event_name')
    raw_id_fields = ('family', 'uploaded_by', 'tagged_members')


@admin.register(MemoryDeletionRequest)
class MemoryDeletionRequestAdmin(admin.ModelAdmin):
    list_display = ('memory_item', 'requested_by', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    raw_id_fields = ('memory_item', 'requested_by', 'reviewed_by')