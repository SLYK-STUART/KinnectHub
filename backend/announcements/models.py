from django.db import models
import uuid
from accounts.models import FamilyMember
from django.utils.timezone import now

# Create your models here.
class Announcement(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    author = models.ForeignKey(
        FamilyMember,
        on_delete=models.CASCADE,
        related_name='announcements'
    )

    title = models.CharField(max_length=300)
    message = models.TextField()

    is_for_all = models.BooleanField(
        default=True,
        help_text="If true, announcement visible to entire family"
    )

    # Audience
    targeted_members = models.ManyToManyField(
        FamilyMember,
        related_name='targeted_announcements',
        blank=True
    )

    # Features
    is_urgent = models.BooleanField(default=False)
    has_voice_note = models.BooleanField(default=False)
    voice_note_url = models.URLField(blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Announcement"
        verbose_name_plural = "Announcements"

    def __str__ (self):
        return f"{self.title} by {self.author.full_name}"
    
    @property
    def recipient_count(self):
        return self.targeted_members.count() if not self.is_for_all else "All Family"
    

class AnnouncementReply(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    announcement = models.ForeignKey(Announcement, on_delete=models.CASCADE,
                                     related_name='replies')
    parent_reply = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True, blank=True, related_name='child_replies'
    )

    author = models.ForeignKey(
        FamilyMember,
        on_delete=models.CASCADE
    )
    message = models.TextField()
    voice_note_url = models.URLField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = "Announcement Reply"
        verbose_name_plural = "Announcement Replies"

    def __str__ (self):
        return f"Reply by {self.author.full_name}"
    
class Poll(models.Model):
    announcement = models.OneToOneField(
        Announcement,
        on_delete=models.CASCADE,
        related_name='poll'
    )
    question = models.CharField(max_length=255)
    deadline = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__ (self):
        return self.question
    
class PollOption(models.Model):
    poll = models.ForeignKey(
        Poll,
        on_delete=models.CASCADE,
        related_name='options',
    )
    text = models.CharField(max_length=200)
    votes = models.ManyToManyField(
        FamilyMember,
        related_name='poll_votes',
        blank=True,
    )

    def vote_count(self):
        return self.votes.count()
    
    def __str__ (self):
        return self.text