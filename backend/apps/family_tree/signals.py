from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.accounts.models import FamilyMember
from .models import Family, FamilyTreeNode


@receiver(post_save, sender=FamilyMember)
def create_family_tree_node(sender, instance, created, **kwargs):
    if not created:
        return

    # Single shared Family — don't key lookup off is_admin
    family = Family.objects.first()
    if family is None:
        family = Family.objects.create(
            family_name=f"{instance.full_name.split()[-1]} Family",
            admin=instance,
        )

    FamilyTreeNode.objects.get_or_create(
        member=instance,
        defaults={
            'family': family,
            'is_living': True,
            'x_position': 400,
            'y_position': 100 if instance.is_admin else 300,
        }
    )