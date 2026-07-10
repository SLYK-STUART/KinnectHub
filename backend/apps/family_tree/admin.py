from django.contrib import admin
from .models import Family, FamilyTreeNode, FamilyRelationship


@admin.register(Family)
class FamilyAdmin(admin.ModelAdmin):
    list_display = ('family_name', 'admin', 'created_at')
    search_fields = ('family_name',)


@admin.register(FamilyTreeNode)
class FamilyTreeNodeAdmin(admin.ModelAdmin):
    list_display = ('member', 'is_living', 'date_of_death', 'family')
    list_filter = ('is_living', 'family')
    search_fields = ('member__full_name',)
    raw_id_fields = ('member', 'family')


@admin.register(FamilyRelationship)
class FamilyRelationshipAdmin(admin.ModelAdmin):
    list_display = ('from_node', 'relationship_type', 'to_node', 'marriage_date', 'is_current')
    list_filter = ('relationship_type', 'is_current')
    raw_id_fields = ('from_node', 'to_node')