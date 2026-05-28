from rest_framework import serializers
from .models import FamilyMember

class FamilyMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyMember
        fields = [
            'id', 'email', 'full_name',
            'family_role', 'phone_number',
            'is_admin', 'date_joined'
        ]
        read_only_fields = ['is_admin']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyMember
        fields = ['email', 'full_name', "password"]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = FamilyMember.objects.create_user(
            email = validated_data['email'],
            full_name = validated_data['full_name'],
            password = validated_data['password']
        )
        return user