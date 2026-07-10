from rest_framework import serializers
from apps.accounts.models import FamilyMember
from .models import MemoryItem, MemoryDeletionRequest


class FamilyMemberBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyMember
        fields = ['id', 'full_name', 'family_role']


class MemoryItemListSerializer(serializers.ModelSerializer):
    uploaded_by = FamilyMemberBasicSerializer(read_only=True)
    tagged_members_count = serializers.SerializerMethodField()

    class Meta:
        model = MemoryItem
        fields = [
            'id', 'item_type', 'title', 'file', 'thumbnail',
            'uploaded_by', 'created_at', 'year', 'event_name', 'album',
            'tagged_members_count'
        ]

    def get_tagged_members_count(self, obj):
        return obj.tagged_members.count()


class MemoryItemDetailSerializer(serializers.ModelSerializer):
    uploaded_by = FamilyMemberBasicSerializer(read_only=True)
    tagged_members = FamilyMemberBasicSerializer(many=True, read_only=True)

    class Meta:
        model = MemoryItem
        fields = [
            'id', 'item_type', 'title', 'description', 'file', 'thumbnail',
            'uploaded_by', 'created_at', 'updated_at',
            'year', 'event_name', 'album',
            'tagged_members'
        ]


class MemoryItemCreateSerializer(serializers.ModelSerializer):
    tagged_member_ids = serializers.ListField(
        child=serializers.UUIDField(),
        required=False,
        write_only=True
    )

    class Meta:
        model = MemoryItem
        fields = [
            'title', 'description', 'file', 'item_type',
            'year', 'event_name', 'album', 'tagged_member_ids'
        ]

    def create(self, validated_data):
        tagged_member_ids = validated_data.pop('tagged_member_ids', [])
        memory_item = MemoryItem.objects.create(**validated_data)
        if tagged_member_ids:
            tagged_members = FamilyMember.objects.filter(id__in=tagged_member_ids)
            memory_item.tagged_members.set(tagged_members)
        return memory_item


class MemoryDeletionRequestSerializer(serializers.ModelSerializer):
    memory_item = MemoryItemListSerializer(read_only=True)
    requested_by = FamilyMemberBasicSerializer(read_only=True)
    reviewed_by = FamilyMemberBasicSerializer(read_only=True)

    class Meta:
        model = MemoryDeletionRequest
        fields = [
            'id', 'memory_item', 'requested_by', 'reason',
            'status', 'reviewed_by', 'created_at'
        ]


class MemoryDeletionRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemoryDeletionRequest
        fields = ['reason']  # memory_item and requested_by injected by view