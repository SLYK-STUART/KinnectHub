import uuid
from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from apps.accounts.models import FamilyMember
from apps.family_tree.models import Family


class VaultCategory(models.Model):
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4,
        editable=False
    )

    family = models.ForeignKey(
        Family, on_delete=models.CASCADE, related_name='vault_categories'
    )
    name = models.CharField(max_length=100, choices=[
        ('identity', 'Identity Documents'),
        ('medical', 'Medical Records'),
        ('legal', 'Land & legal Documents'),
        ('academic', 'Academic Certificates'),
        ('financial', 'Financial Documents'),
        ('other', 'Other'),
    ])
    custom_name = models.CharField(max_length=255, blank=True, null=True)

    passcode_hash = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.ForeignKey(
        FamilyMember, on_delete=models.CASCADE,
        related_name='created_vaults'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('family', 'name', 'custom_name')
        verbose_name = "Vault Category"
        verbose_name_plural = "Vault Categories"

    def __str__(self):
        return self.custom_name or dict(VaultCategory._meta.get_field('name').choices).get(self.name, self.name)

    @property
    def is_locked(self):
        return bool(self.passcode_hash)

    def set_passcode(self, raw_passcode):
        self.passcode_hash = make_password(raw_passcode) if raw_passcode else None

    def check_passcode(self, raw_passcode):
        if not self.passcode_hash:
            return True
        if not raw_passcode:
            return False
        return check_password(raw_passcode, self.passcode_hash)


class VaultDocument(models.Model):
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )

    category = models.ForeignKey(
        VaultCategory, on_delete=models.CASCADE,
        related_name='documents'
    )
    uploaded_by = models.ForeignKey(
        FamilyMember, on_delete=models.CASCADE,
        related_name='uploaded_documents'
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='vault_documents/%Y/%m/')

    expiry_date = models.DateTimeField(null=True, blank=True)
    tags = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.category})"