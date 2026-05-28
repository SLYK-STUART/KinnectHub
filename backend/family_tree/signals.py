from django.db.models.signals import post_save
from django.dispatch import receiver
from accounts.models import FamilyMember
from .models import Family, FamilyTreeNode

@receiver(post_save, sender=FamilyMember)
def create_family_tree_node(sender, instance, created, **kwargs):


    if created:
        family, family_created = Family.objects.get_or_create(
            admin=instance if instance.is_admin else None,
            defaults={
                'family_name': f"{instance.full_name.split()[-1]} Family",
                'admin': instance
            }
        )

        if instance.is_admin and family_created:
            family.admin = instance
            family.save()

        FamilyTreeNode.objects.get_or_create(
            family = family,
            member=instance,
            defaults={
                'is_living': True,

                'x_position': 400,
                'y_position': 100 if instance.is_admin else 300,
            }
        )