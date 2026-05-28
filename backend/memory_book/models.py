import uuid
from django.db import models
from accounts.models import FamilyMember
from family_tree.models import Family

class MemoryItem(models.Model):
    ITEM_TYPES = [
        ('photo', 'Photo'),
        ('video', 'Video'),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    family = models.ForeignKey(
        Family, on_delete=models.CASCADE, related_name='memory_items'
    )
    uploaded_by = models.ForeignKey(FamilyMember, on_delete=models.CASCADE,
                                    related_name='uploaded_memories')
    
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    item_type = models.CharField(max_length=10, choices=ITEM_TYPES, default='photo')

    file = models.FileField(upload_to='memory_items/%Y/%m/')
    thumbnail = models.ImageField(upload_to='memory_thumbnails/%Y/%m/', blank=True, null=True)

    year = models.IntegerField(null=True, blank=True)
    event_name = models.CharField(max_length=255, blank=True, null=True)
    album = models.CharField(max_length=255, blank=True, null=True)

    tagged_members = models.ManyToManyField(FamilyMember, related_name='tagged_in_memories', blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Memory Item"
        verbose_name_plural = "Memory Items"

    def __str__ (self):
        return f"{self.item_type.title()} by {self.uploaded_by.full_name}"
    
class MemoryDeletionRequest(models.Model):
    memory_item = models.ForeignKey(MemoryItem, on_delete=models.CASCADE,
                                    related_name='deletion_requests')
    requested_by = models.ForeignKey(FamilyMember, on_delete=models.CASCADE)
    reason = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ], default='pending')
    reviewed_by = models.ForeignKey(
        FamilyMember, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='reviewed_deletions'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__ (self):
        return f"Deletion request for {self.memory_item} - {self.status}"