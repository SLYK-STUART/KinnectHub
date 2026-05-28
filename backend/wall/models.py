import uuid
from django.db import models
from accounts.models import FamilyMember
from family_tree.models import Family


class WallPost(models.Model):
    POST_TYPES = [
        ('prayer', 'Prayer Request'),
        ('gratitude', 'Gratitude'),
        ('testimony', 'Testimony'),
        ('general', 'General'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='wall_posts')
    author = models.ForeignKey(FamilyMember, on_delete=models.CASCADE, 
                             related_name='wall_posts')
    
    post_type = models.CharField(max_length=20, choices=POST_TYPES, default='prayer')
    message = models.TextField()
    
    # Reactions (simple emoji count)
    reactions = models.JSONField(default=dict, blank=True)  # e.g. {"🙏": 5, "❤️": 3}
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Wall Post"
        verbose_name_plural = "Wall Posts"

    def __str__(self):
        return f"{self.get_post_type_display()} by {self.author.full_name}"


class WallReply(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    post = models.ForeignKey(WallPost, on_delete=models.CASCADE, related_name='replies')
    author = models.ForeignKey(FamilyMember, on_delete=models.CASCADE)
    message = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Reply by {self.author.full_name}"


# Signal to notify when someone reacts or replies (can be expanded later)
from django.db.models.signals import post_save
from django.dispatch import receiver
from notifications.models import Notification


@receiver(post_save, sender=WallReply)
def notify_on_wall_reply(sender, instance, created, **kwargs):
    if created:
        # Notification logic can be added here
        pass