from django.contrib import admin
from .models import LocationShare, SOSAlert, SafetyResponse


@admin.register(LocationShare)
class LocationShareAdmin(admin.ModelAdmin):
    list_display = ('shared_by', 'location_name', 'created_at', 'is_active')
    list_filter = ('is_active', 'created_at')
    search_fields = ('shared_by__full_name', 'location_name')
    raw_id_fields = ('shared_by', 'family')


@admin.register(SOSAlert)
class SOSAlertAdmin(admin.ModelAdmin):
    list_display = ('triggered_by', 'status', 'created_at', 'resolved_by')
    list_filter = ('status', 'created_at')
    search_fields = ('triggered_by__full_name', 'message')
    raw_id_fields = ('triggered_by', 'family', 'resolved_by')


@admin.register(SafetyResponse)
class SafetyResponseAdmin(admin.ModelAdmin):
    list_display = ('sos_alert', 'responded_by', 'created_at')
    raw_id_fields = ('sos_alert', 'responded_by')