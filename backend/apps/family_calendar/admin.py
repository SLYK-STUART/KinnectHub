from django.contrib import admin
from .models import Event, EventParticipant


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'event_type', 'start_date', 'created_by', 'is_recurring')
    list_filter = ('event_type', 'is_recurring', 'start_date')
    search_fields = ('title', 'description', 'created_by__full_name')
    raw_id_fields = ('created_by', 'family')


@admin.register(EventParticipant)
class EventParticipantAdmin(admin.ModelAdmin):
    list_display = ('event', 'member', 'is_attending')
    list_filter = ('is_attending',)
    raw_id_fields = ('event', 'member')