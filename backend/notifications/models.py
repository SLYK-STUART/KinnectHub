import uuid
from django.db import models
from accounts.models import FamilyMember
from family_tree.models import Family


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('announcement', 'New Announcement'),
        ('reply', 'Reply to Announcement'),
        ('sos', 'SOS Alert'),
        ('location', 'Location Share'),
        ('calendar', 'Calendar Event'),
        ('memory', 'Memory Tagged'),
        ('vault', 'Vault Activity'),
        ('general', 'General'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    recipient = models.ForeignKey(FamilyMember, on_delete=models.CASCADE, 
                                related_name='notifications')
    sender = models.ForeignKey(FamilyMember, on_delete=models.SET_NULL, 
                             null=True, blank=True, related_name='sent_notifications')
    
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    
    # Related objects (Generic relations for flexibility)
    related_announcement_id = models.UUIDField(null=True, blank=True)
    related_sos_id = models.UUIDField(null=True, blank=True)
    related_event_id = models.UUIDField(null=True, blank=True)
    related_memory_id = models.UUIDField(null=True, blank=True)
    
    is_read = models.BooleanField(default=False)
    is_pushed = models.BooleanField(default=False)  # Whether FCM was sent
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"

    def __str__(self):
        return f"{self.notification_type} to {self.recipient.full_name}"


class PushNotificationToken(models.Model):
    """Stores FCM / Web Push tokens for each device"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    user = models.ForeignKey(FamilyMember, on_delete=models.CASCADE, 
                           related_name='push_tokens')
    token = models.TextField(unique=True)
    device_type = models.CharField(max_length=50, blank=True, null=True)  # android, ios, web
    device_name = models.CharField(max_length=255, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    last_used = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-last_used']

    def __str__(self):
        return f"{self.user.full_name} - {self.device_type}"