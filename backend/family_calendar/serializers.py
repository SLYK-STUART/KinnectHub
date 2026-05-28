from rest_framework import serializers
from accounts.models import FamilyMember
from .models import Event, EventParticipant

class FamilyMemberBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyMember
        fields = ['id', 'full_name', 'family_role']

class EventParticipantSerializer(serializers.ModelSerializer):
    member = FamilyMemberBasicSerializer(read_only=True)

    class Meta:
        model = EventParticipant
        fields = ['id', 'member', 'is_attending', 'response_date']

class EventSerializer(serializers.ModelSerializer):
    created_by = FamilyMemberBasicSerializer(read_only=True)
    participants = EventParticipantSerializer(many=True, read_only=True)
    is_upcoming = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'event_type', 'start_date',
            'end_date', 'is_recurring', 'recurrence_frequency', 'created_by',
            'created_at', 'participants', 'is_upcoming'
        ]

    def get_is_upcoming(self, obj):
        from django.utils.timezone import now
        return obj.start_date > now()
    
class EventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model =Event
        fields = [
            'title', 'description', 'event_type', 'start_date', 'end_date',
            'is_recurring', 'recurrence_frequency'
        ]

    def validate(self, data):
        if data.get('end_date') and data['end_date'] < data['start_date']:
            raise serializers.ValidationError("End date cannot be before the start date.")
        return data
    
class EventListSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(
        source='created_by.full_name', read_only=True
    )

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'event_type', 'start_date', 'end_date',
            'is_recurring', 'created_by_name'
        ]

class EventDetailSerializer(serializers.ModelSerializer):
    created_by = FamilyMemberBasicSerializer(read_only=True)
    participants = EventParticipantSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'event_type', 'start_date',
            'end_date', 'is_recurring', 'recurrence_frequency', 'created_by',
            'created_at', 'updated_at', 'participants'
        ]