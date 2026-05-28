from rest_framework import serializers
from accounts.models import FamilyMember
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
        return obj.replies.count()

    def get_reaction_summary(self, obj):
        # Return top 3 reactions
        return dict(list(obj.reactions.items())[:3])


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
    emoji = serializers.CharField(max_length=10, required=True)