from rest_framework import serializers
from apps.accounts.models import FamilyMember
from .models import WallPost, WallReply


class FamilyMemberBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyMember
        fields = ['id', 'full_name', 'family_role']


# ====================== WALL REPLY SERIALIZERS ======================
class WallReplySerializer(serializers.ModelSerializer):
    author = FamilyMemberBasicSerializer(read_only=True)

    class Meta:
        model = WallReply
        fields = ['id', 'author', 'message', 'created_at']


class WallReplyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WallReply
        fields = ['message']


# ====================== WALL POST SERIALIZERS ======================
class WallPostListSerializer(serializers.ModelSerializer):
    author = FamilyMemberBasicSerializer(read_only=True)
    reply_count = serializers.SerializerMethodField()
    reaction_summary = serializers.SerializerMethodField()

    class Meta:
        model = WallPost
        fields = [
            'id', 'post_type', 'message', 'author', 'reactions',
            'reply_count', 'reaction_summary', 'created_at'
        ]

    def get_reply_count(self, obj):
        return getattr(obj, 'reply_total', obj.replies.count())

    def get_reaction_summary(self, obj):
        reactions = obj.reactions or {}
        top_reactions = sorted(
            reactions.items(),
            key=lambda item: item[1],
            reverse=True,
        )[:3]
        return dict(top_reactions)


class WallPostDetailSerializer(serializers.ModelSerializer):
    author = FamilyMemberBasicSerializer(read_only=True)
    replies = WallReplySerializer(many=True, read_only=True)

    class Meta:
        model = WallPost
        fields = [
            'id', 'post_type', 'message', 'author', 'reactions',
            'created_at', 'updated_at', 'replies'
        ]


class WallPostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WallPost
        fields = ['post_type', 'message']


class ReactionSerializer(serializers.Serializer):
    """For adding/removing reactions"""
    emoji = serializers.CharField(
        max_length=10,
        required=True,
        trim_whitespace=False,
    )

    def validate_emoji(self, value):
        if not value.strip():
            raise serializers.ValidationError('Reaction emoji is required.')
        return value
