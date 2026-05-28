import uuid
from django.db import models
from accounts.models import FamilyMember
from django.utils.timezone import now

class Event(models.Model):
    EVENT_TYPES = [
        ('birthday', 'Birthday'),
        ('meeting','Family Meeting'),
        ('gathering', 'Family Gathering'),
        ('medical', 'Medical Appointment'),
        ('travel', 'Travel'),
        ('other', 'Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES, default='other')

    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)

    is_recurring = models.BooleanField(default=False)
    recurrence_frequency = models.CharField(
        max_length=20,
        choices=[
            ('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly'),
            ('yearly', 'Yearly')
        ],
        blank=True, null=True,
    )

    created_by = models.ForeignKey(FamilyMember, on_delete=models.CASCADE,
                                   related_name='created_events')
    family = models.ForeignKey(
        'family_tree.Family', on_delete=models.CASCADE,
        related_name='events'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['start_date']
        verbose_name = "Event"
        verbose_name_plural = "Events"

    def __str__ (self):
        return f"{self.title} - {self.start_date.date()}"

class EventParticipant(models.Model): #optional - Track who is attending
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE,
        related_name='participants'
    )
    member = models.ForeignKey(
        FamilyMember, on_delete=models.CASCADE
    )
    is_attending = models.BooleanField(default=True)
    response_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'member')

from django.db.models.signals import post_save
from django.dispatch import receiver
from profiles.models import Profile

@receiver(post_save, sender=Profile)
def create_birthday_event(sender, instance, created, **kwargs):
    if instance.date_of_birth:
        pass