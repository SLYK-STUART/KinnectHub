import uuid
from django.db import models
from apps.accounts.models import FamilyMember


class Family(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    family_name = models.CharField(max_length=255, default="Tayebwa Family")
    created_at = models.DateTimeField(auto_now_add=True)
    admin = models.ForeignKey(FamilyMember, on_delete=models.PROTECT,
                              related_name='admin_of_families')

    def __str__(self):
        return self.family_name

    class Meta:
        verbose_name_plural = "Families"


class FamilyTreeNode(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    family = models.ForeignKey(Family, on_delete=models.CASCADE,
                               related_name='tree_nodes')
    member = models.OneToOneField(FamilyMember, on_delete=models.CASCADE,
                                  related_name='tree_node')

    is_living = models.BooleanField(default=True)
    date_of_death = models.DateField(null=True, blank=True)
    death_notes = models.TextField(blank=True, null=True)

    x_position = models.FloatField(default=0)
    y_position = models.FloatField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['member__full_name']

    def __str__(self):
        status = "🕊️" if not self.is_living else "👤"
        return f"{status} {self.member.full_name}"

    # Helper methods
    def get_spouse(self):
        spouse_rel = self.outgoing_relationships.filter(
            relationship_type='spouse', is_current=True
        ).first()
        return spouse_rel.to_node if spouse_rel else None

    def get_parents(self):
        return [rel.from_node for rel in self.incoming_relationships.filter(
            relationship_type='parent'
        )]

    def get_children(self):
        return [rel.to_node for rel in self.outgoing_relationships.filter(
            relationship_type='child'
        )]


class FamilyRelationship(models.Model):
    RELATIONSHIP_TYPES = [
        ('spouse', 'Spouse'),
        ('parent', 'Parent'),
        ('child', 'Child'),
        ('sibling', 'Sibling'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    from_node = models.ForeignKey(
        FamilyTreeNode, 
        on_delete=models.CASCADE,
        related_name='outgoing_relationships'
    )
    to_node = models.ForeignKey(
        FamilyTreeNode, 
        on_delete=models.CASCADE,
        related_name='incoming_relationships'
    )

    relationship_type = models.CharField(max_length=20, choices=RELATIONSHIP_TYPES)

    marriage_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_node', 'to_node', 'relationship_type')
        ordering = ['relationship_type']

    def __str__(self):
        return f"{self.from_node.member.full_name} - {self.relationship_type} - {self.to_node.member.full_name}"



