from rest_framework import serializers
from apps.accounts.models import FamilyMember
from .models import LocationShare, SOSAlert, SafetyResponse


class FamilyMemberBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyMember
        fields = ['id', 'full_name', 'family_role']


# ====================== LOCATION SHARE ======================
class LocationShareSerializer(serializers.ModelSerializer):
    shared_by = FamilyMemberBasicSerializer(read_only=True)

    class Meta:
        model = LocationShare
        fields = [
            'id', 'shared_by', 'latitude', 'longitude', 'location_name',
            'expires_at', 'is_active', 'created_at'
        ]


class LocationShareCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationShare
        fields = ['latitude', 'longitude', 'location_name', 'expires_at']


# ====================== SOS ALERT ======================
class SOSAlertSerializer(serializers.ModelSerializer):
    triggered_by = FamilyMemberBasicSerializer(read_only=True)
    resolved_by = FamilyMemberBasicSerializer(read_only=True)
    responses = serializers.SerializerMethodField()

    class Meta:
        model = SOSAlert
        fields = [
            'id', 'triggered_by', 'latitude', 'longitude', 'message', 'location_name',
            'status', 'created_at', 'resolved_at', 'resolved_by', 'responses'
        ]

    def get_responses(self, obj):
        responses = obj.responses.all()[:5]  # Limit to recent responses
        return SafetyResponseSerializer(responses, many=True).data


class SOSAlertCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SOSAlert
        fields = ['latitude', 'longitude', 'location_name', 'message']


class SOSAlertUpdateSerializer(serializers.ModelSerializer):
    """For resolving SOS"""
    class Meta:
        model = SOSAlert
        fields = ['status']


# ====================== SAFETY RESPONSE ======================
class SafetyResponseSerializer(serializers.ModelSerializer):
    responded_by = FamilyMemberBasicSerializer(read_only=True)

    class Meta:
        model = SafetyResponse
        fields = ['id', 'responded_by', 'message', 'created_at']


class SafetyResponseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafetyResponse
        fields = ['message']
        extra_kwargs = {'message': {'required': False}}