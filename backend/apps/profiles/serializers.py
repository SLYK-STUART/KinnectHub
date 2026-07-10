from rest_framework import serializers
from apps.accounts.models import FamilyMember
from .models import Profile


class ProfileBasicSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='member.full_name', read_only=True)
    family_role = serializers.CharField(source='member.family_role', read_only=True)

    class Meta:
        model = Profile
        fields = [
            'id', 'member', 'full_name', 'family_role',
            'photo', 'blood_type'
        ]


class ProfileSerializer(serializers.ModelSerializer):  # viewing and editing profile
    member = serializers.SerializerMethodField()
    full_name = serializers.CharField(source='member.full_name', read_only=True)
    family_role = serializers.CharField(source='member.family_role', read_only=True)
    email = serializers.EmailField(source='member.email', read_only=True)

    class Meta:
        model = Profile
        fields = [
            'id', 'member', 'full_name', 'family_role', 'email',
            'photo', 'cover_photo', 'nin', 'phone_number',
            'secondary_phone', 'address', 'blood_type', 'allergies',
            'medical_notes', 'emergency_contact_name', 'emergency_contact_phone',
            'date_of_birth', 'occupation', 'bio', 'updated_at'
        ]
        read_only_fields = ['member']

    def get_member(self, obj):
        return {
            'id': obj.member.id,
            'full_name': obj.member.full_name,
            'family_role': obj.member.family_role,
            'is_admin': obj.member.is_admin,
        }


class ProfileUpdateSerializer(serializers.ModelSerializer):  # user updating their profile
    class Meta:
        model = Profile
        fields = [
            'photo', 'cover_photo', 'nin', 'phone_number', 'secondary_phone',
            'address', 'blood_type', 'allergies', 'medical_notes',
            'emergency_contact_name', 'emergency_contact_phone',
            'date_of_birth', 'occupation', 'bio'
        ]


class ProfileListSerializer(serializers.ModelSerializer):  # listing all family members
    member = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['id', 'member', 'photo', 'blood_type']

    def get_member(self, obj):
        return {
            'id': obj.member.id,
            'full_name': obj.member.full_name,
            'family_role': obj.member.family_role,
            'is_admin': obj.member.is_admin,
        }