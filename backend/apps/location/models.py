import uuid
from django.db import models
from apps.accounts.models import FamilyMember
from apps.family_tree.models import Family
from django.utils.timezone import now


class LocationShare(models.Model):
    """On-demand location sharing"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    shared_by = models.ForeignKey(FamilyMember, on_delete=models.CASCADE, 
                                related_name='shared_locations')
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='location_shares')
    
    latitude = models.FloatField()
    longitude = models.FloatField()
    location_name = models.CharField(max_length=255, blank=True, null=True)  # e.g. "Home", "Kampala"
    
    expires_at = models.DateTimeField(null=True, blank=True)  # For temporary shares
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Location by {self.shared_by.full_name} at {self.created_at}"


class SOSAlert(models.Model):
    """Emergency SOS Alerts"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('resolved', 'Resolved'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    triggered_by = models.ForeignKey(FamilyMember, on_delete=models.CASCADE, 
                                   related_name='triggered_sos')
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='sos_alerts')
    
    latitude = models.FloatField()
    longitude = models.FloatField()
    location_name = models.CharField(max_length=255, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    resolved_by = models.ForeignKey(FamilyMember, on_delete=models.SET_NULL, 
                                  null=True, blank=True, related_name='resolved_sos')
    
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"SOS by {self.triggered_by.full_name} - {self.status}"


class SafetyResponse(models.Model):
    """I'm Safe responses"""
    sos_alert = models.ForeignKey(SOSAlert, on_delete=models.CASCADE, related_name='responses')
    responded_by = models.ForeignKey(FamilyMember, on_delete=models.CASCADE)
    message = models.CharField(max_length=255, blank=True, null=True, 
                             default="I'm Safe")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Safe response by {self.responded_by.full_name}"