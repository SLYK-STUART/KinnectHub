from rest_framework import serializers
from apps.accounts.models import FamilyMember
from .models import Notification, PushNotificationToken


class FamilyMemberBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyMember
        fields = ['id', 'full_name', 'family_role']


# ====================== NOTIFICATION SERIALIZERS ======================
class NotificationSerializer(serializers.ModelSerializer):
    sender = FamilyMemberBasicSerializer(read_only=True)
    recipient = FamilyMemberBasicSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'sender', 'recipient', 'notification_type', 
            'title', 'message', 'is_read', 'created_at',
            'related_announcement_id', 'related_sos_id',
            'related_event_id', 'related_memory_id'
        ]


class NotificationListSerializer(serializers.ModelSerializer):
    """Light serializer for notification list/feed"""
    sender_name = serializers.CharField(source='sender.full_name', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'title', 'message', 
            'sender_name', 'is_read', 'created_at'
        ]


class MarkAsReadSerializer(serializers.Serializer):
    """For marking single or all notifications as read"""
    notification_id = serializers.UUIDField(required=False)
    mark_all = serializers.BooleanField(default=False)


# ====================== PUSH TOKEN SERIALIZERS ======================
class PushNotificationTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = PushNotificationToken
        fields = ['id', 'token', 'device_type', 'device_name', 'last_used']


class PushTokenRegisterSerializer(serializers.ModelSerializer):
    """Used when registering a new device token"""
    class Meta:
        model = PushNotificationToken
        fields = ['token', 'device_type', 'device_name']

    def create(self, validated_data):
        # Prevent duplicate tokens
        token = validated_data.get('token')
        user = self.context['request'].user
        
        # If token exists for this user, update it
        instance, created = PushNotificationToken.objects.update_or_create(
            user=user,
            token=token,
            defaults=validated_data
        )
        return instance