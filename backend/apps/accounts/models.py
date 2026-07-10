import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.utils.timezone import now

class FamilyMemberManager(BaseUserManager):
    def create_user(self, email, full_name, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, full_name, password, **extra_fields)
    
class FamilyMember(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('father', "Father"),
        ('mother', "Mother"),
        ('son', "Son"),
        ("daughter", "Daughter"),
        ('grandfather', "Grandfather"),
        ('grandmother', "GrandMother"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    email = models.EmailField(unique=True, db_index=True)
    full_name = models.CharField(max_length=100)

    family_role = models.CharField(
        choices=ROLE_CHOICES,
        max_length=100,
        blank=True,
        null=True,
        db_index=True,
        help_text="e.g. Father, Mother, 1st Born, etc"
    )
    phone_number = models.CharField(
        unique=True,
        max_length=20,
        blank=True, null=True
    )

    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    must_change_password = models.BooleanField(
        default=True,
        help_text = "Forces user to change password on first login"
    )

    date_joined = models.DateTimeField(auto_now_add=True)
    last_seen = models.DateTimeField(null=True, blank=True)
    last_password_change = models.DateTimeField(null=True, blank=True)
    firebase_uid = models.CharField(
        max_length=128,
        unique=True,
        null=True,
        blank=True,
        db_index=True,
        help_text="Linked Firebase Auth UID, set on first Flutter login"
    )

    objects = FamilyMemberManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        verbose_name = "Family Member"
        verbose_name_plural = "Family Members"
        ordering = ['full_name']

    def __str__(self):
        return f"{self.full_name} ({self.email})"
    
    
    def update_last_seen(self):
        self.last_seen = now()
        self.save(update_fields=['last_seen'])