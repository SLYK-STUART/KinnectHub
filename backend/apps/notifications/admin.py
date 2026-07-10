from django.contrib import admin
from .models import Notification, PushNotificationToken


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('recipient', 'notification_type', 'title', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('title', 'message', 'recipient__full_name')
    raw_id_fields = ('recipient', 'sender')


@admin.register(PushNotificationToken)
class PushNotificationTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'device_type', 'device_name', 'last_used')
    list_filter = ('device_type',)
    search_fields = ('user__full_name', 'token')
    raw_id_fields = ('user',)