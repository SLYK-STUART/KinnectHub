import uuid
from django.db import models
from accounts.models import FamilyMember


class Profile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    member = models.OneToOneField(FamilyMember, on_delete=models.CASCADE, 
                                related_name='profile')
    
    # Basic Info
    photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    cover_photo = models.ImageField(upload_to='cover_photos/', blank=True, null=True)
    
    # National ID
    nin = models.CharField(max_length=20, blank=True, null=True, 
                         verbose_name="National Identification Number")
    
    # Contact
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    secondary_phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    
    # Emergency / Medical
    blood_type = models.CharField(max_length=10, blank=True, null=True, 
                                choices=[
                                    ('A+', 'A+'), ('A-', 'A-'),
                                    ('B+', 'B+'), ('B-', 'B-'),
                                    ('O+', 'O+'), ('O-', 'O-'),
                                    ('AB+', 'AB+'), ('AB-', 'AB-'),
                                ])
    allergies = models.TextField(blank=True, null=True, 
                               help_text="List any known allergies")
    medical_notes = models.TextField(blank=True, null=True, 
                                   help_text="Important medical conditions, medications, etc.")
    emergency_contact_name = models.CharField(max_length=255, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Additional
    date_of_birth = models.DateField(null=True, blank=True)
    occupation = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Profile"
        verbose_name_plural = "Profiles"

    def __str__(self):
        return f"Profile of {self.member.full_name}"


# Signal to auto-create profile when a new FamilyMember is created
from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender=FamilyMember)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(member=instance)