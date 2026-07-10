from rest_framework import serializers
from apps.accounts.models import FamilyMember
from .models import VaultCategory, VaultDocument


class FamilyMemberBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyMember
        fields = ['id', 'full_name', 'family_role']


# ====================== VAULT CATEGORY SERIALIZERS ======================
class VaultCategorySerializer(serializers.ModelSerializer):
    created_by = FamilyMemberBasicSerializer(read_only=True)
    document_count = serializers.SerializerMethodField()
    is_locked = serializers.BooleanField(read_only=True)

    class Meta:
        model = VaultCategory
        fields = ['id', 'name', 'custom_name', 'created_by',
                  'document_count', 'is_locked', 'created_at']

    def get_document_count(self, obj):
        return obj.documents.count()


class VaultCategoryCreateSerializer(serializers.ModelSerializer):
    passcode = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = VaultCategory
        fields = ['name', 'custom_name', 'passcode']

    def create(self, validated_data):
        passcode = validated_data.pop('passcode', None)
        category = VaultCategory(**validated_data)
        if passcode:
            category.set_passcode(passcode)
        category.save()
        return category


class VaultCategorySetPasscodeSerializer(serializers.Serializer):
    passcode = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    def save(self, **kwargs):
        category = self.context['category']
        category.set_passcode(self.validated_data.get('passcode'))
        category.save(update_fields=['passcode_hash'])
        return category


class VaultCategoryUnlockSerializer(serializers.Serializer):
    passcode = serializers.CharField()


# ====================== VAULT DOCUMENT SERIALIZERS ======================
class VaultDocumentListSerializer(serializers.ModelSerializer):
    uploaded_by = FamilyMemberBasicSerializer(read_only=True)
    category_name = serializers.CharField(source='category.custom_name', read_only=True)

    class Meta:
        model = VaultDocument
        fields = [
            'id', 'title', 'file', 'category_name', 'uploaded_by',
            'created_at', 'expiry_date'
        ]


class VaultDocumentDetailSerializer(serializers.ModelSerializer):
    uploaded_by = FamilyMemberBasicSerializer(read_only=True)
    category = VaultCategorySerializer(read_only=True)

    class Meta:
        model = VaultDocument
        fields = [
            'id', 'title', 'description', 'file', 'category',
            'uploaded_by', 'created_at', 'updated_at',
            'expiry_date', 'tags'
        ]


class VaultDocumentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = VaultDocument
        fields = ['title', 'description', 'file', 'expiry_date', 'tags']


class VaultDocumentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = VaultDocument
        fields = ['title', 'description', 'expiry_date', 'tags']