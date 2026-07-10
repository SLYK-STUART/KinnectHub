from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password

from .models import FamilyMember


class FamilyMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyMember
        fields = [
            'id',
            'email',
            'full_name',
            'family_role',
            'phone_number',
            'is_admin',
            'date_joined',
        ]
        read_only_fields = [
            'id',
            'is_admin',
            'date_joined',
        ]


class CreateFamilyMemberSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
    )

    class Meta:
        model = FamilyMember
        fields = [
            'email',
            'full_name',
            'family_role',
            'phone_number',
            'password',
        ]

    def validate_email(self, value):
        if FamilyMember.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )
        return value

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate_phone_number(self, value):
        if value and FamilyMember.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError(
                "A user with this phone number already exists."
            )
        return value

    def create(self, validated_data):
        return FamilyMember.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password'],
            family_role=validated_data.get('family_role'),
            phone_number=validated_data.get('phone_number'),
        )
    
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value
    
class UpdateFamilyMemberSerializer(serializers.ModelSerializer):

    class Meta:
        model = FamilyMember
        fields = [
            'full_name',
            'family_role',
            'phone_number',
            'is_active',
        ]
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(
            username=email,
            password=password
        )

        if not user:
            raise serializers.ValidationError(
                "Invalid email or password."
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "Account is disabled."
            )

        attrs["user"] = user
        return attrs