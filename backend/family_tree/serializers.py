from rest_framework import serializers
from accounts.models import FamilyMember
from .models import Family, FamilyTreeNode, FamilyRelationship


# ====================== BASIC SERIALIZERS ======================
class FamilyMemberBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyMember
        fields = ['id', 'full_name', 'family_role', 'email', 'phone_number']


class FamilySerializer(serializers.ModelSerializer):
    admin = FamilyMemberBasicSerializer(read_only=True)

    class Meta:
        model = Family
        fields = ['id', 'family_name', 'admin', 'created_at']


# ====================== FAMILY TREE NODE ======================
class FamilyTreeNodeSerializer(serializers.ModelSerializer):
    member = FamilyMemberBasicSerializer(read_only=True)
    full_name = serializers.CharField(source='member.full_name', read_only=True)
    family_role = serializers.CharField(source='member.family_role', read_only=True)
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = FamilyTreeNode
        fields = ['id', 'member', 'full_name', 'family_role', 'is_living',
                  'date_of_death', 'death_notes', 'x_position', 'y_position',
                  'photo_url']

    def get_photo_url(self, obj):
        # TODO: Connect to profile photo later
        return None


class FamilyTreeNodeCreateSerializer(serializers.ModelSerializer):
    member_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = FamilyTreeNode
        fields = ['member_id', 'is_living', 'date_of_death', 'death_notes',
                  'x_position', 'y_position']

    def validate_member_id(self, value):
        if not FamilyMember.objects.filter(id=value).exists():
            raise serializers.ValidationError("Member does not exist.")
        return value

    def create(self, validated_data):
        member_id = validated_data.pop('member_id')
        member = FamilyMember.objects.get(id=member_id)
        return FamilyTreeNode.objects.create(member=member, **validated_data)


# ====================== FAMILY RELATIONSHIP ======================
class FamilyRelationshipSerializer(serializers.ModelSerializer):
    from_node = FamilyTreeNodeSerializer(read_only=True)
    to_node = FamilyTreeNodeSerializer(read_only=True)
    
    from_member = serializers.SerializerMethodField()
    to_member = serializers.SerializerMethodField()

    class Meta:
        model = FamilyRelationship
        fields = ['id', 'from_node', 'to_node', 'from_member', 'to_member',
                 'relationship_type', 'marriage_date', 'is_current']

    def get_from_member(self, obj):
        return {
            'id': obj.from_node.member.id,
            'full_name': obj.from_node.member.full_name,
            'family_role': obj.from_node.member.family_role
        }

    def get_to_member(self, obj):
        return {
            'id': obj.to_node.member.id,
            'full_name': obj.to_node.member.full_name,
            'family_role': obj.to_node.member.family_role
        }


class FamilyRelationshipCreateSerializer(serializers.ModelSerializer):
    from_node_id = serializers.UUIDField(write_only=True)
    to_node_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = FamilyRelationship
        fields = ['from_node_id', 'to_node_id', 'relationship_type',
                 'marriage_date', 'is_current']

    def create(self, validated_data):
        from_node = FamilyTreeNode.objects.get(id=validated_data.pop('from_node_id'))
        to_node = FamilyTreeNode.objects.get(id=validated_data.pop('to_node_id'))
        
        relationship = FamilyRelationship.objects.create(
            from_node=from_node,
            to_node=to_node,
            **validated_data
        )
        return relationship


# ====================== FULL TREE (For Homepage) ======================
class FullFamilyTreeSerializer(serializers.Serializer):
    """Main serializer used to load the complete family tree on homepage"""
    family = FamilySerializer()
    nodes = FamilyTreeNodeSerializer(many=True)
    relationships = FamilyRelationshipSerializer(many=True)