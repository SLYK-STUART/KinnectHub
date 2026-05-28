from rest_framework import serializers
from accounts.models import FamilyMember
from .models import Announcement, AnnouncementReply, Poll, PollOption

class PollOptionSerializer(serializers.ModelSerializer):
    vote_count = serializers.SerializerMethodField()

    class Meta:
        model = PollOption
        fields = ['id', 'text', 'vote_count']

        def get_vote_count(self, obj):
            return obj.vote_count()
        
class PollSerializer(serializers.ModelSerializer):
    options = PollOptionSerializer(many=True, read_only = True)

    class Meta:
        model = Poll
        fields = ['id', 'question', 'deadline', 'options']

class AnnouncemnentReplySerializer(serializers.ModelSerializer):
    is_voice_note = serializers.BooleanField(source='voice_note_url', read_only=True)

    class Meta:
        model = AnnouncementReply
        fields = ['id', 'author', 'message',
                  'voice_note_url', 'is_voice_note',
                  'created_at', 'parent_reply']
        read_only_fields = ['author']

        def get_author(self, obj):
            return {
                'id': obj.author.id,
                'full_name': obj.author.full_name,
                'family_role': obj.author.familt_role,
            }
        
class AnnouncementreplyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnnouncementReply
        fields = ['message', 'voice_note_url', 'parent_reply']

class AnnouncementListSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    reply_count = serializers.SerializerMethodField()
    has_poll = serializers.SerializerMethodField()

    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'message', 'author',
            'is_urgent', 'is_for_all', 'created_at', 
            'reply_count', 'has_poll', 'voice_note_url'
        ]

    def get_author(self, obj):
        return {
            'id': obj.author.id,
            'full_name': obj.author.full_name,
            'family_role': obj.author.family_role,
        }
    
    def get_reply_count(self, obj):
        return obj.replies.count()
    
    def get_has_poll(self, obj):
        return hasattr(obj, 'poll') and obj.poll is not None
    
class AnnouncementDetailSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    replies = AnnouncemnentReplySerializer(many=True, read_only=True)
    poll = PollSerializer(read_only=True)
    targeted_members = serializers.SerializerMethodField()

    class Meta:
        model = Announcement
        fields = ['id', 'title', 'message', 'author', 'is_urgent', 'is_for_all',
                 'targeted_members', 'created_at', 'updated_at', 'voice_note_url',
                 'replies', 'poll']
        
    def get_author(self, obj):
        return {
            'id': obj.author.id,
            'full_name': obj.author.full_name,
            'family_role': obj.author.family_role,
        }
    
    def get_targeted_members(self, obj):
        if obj.is_for_all:
            return "All Family Members"
        return [{"id": m.id, "full_namr": m.full_name} for m in obj.targeted_members.all()]
    
class AnnouncementCreateSerializer(serializers.ModelSerializer):
    poll_question = serializers.CharField(required=False, write_only=True)
    poll_options = serializers.ListField(child=serializers.CharField(),
                                         required=False, write_only=True)
    
    class Meta:
        model = Announcement
        model = Announcement
        fields = ['title', 'message', 'is_for_all', 'targeted_members', 
                 'is_urgent', 'voice_note_url', 'poll_question', 'poll_options']
        
    def create(self, validated_data):
        poll_question = validated_data.pop('poll_question', None)
        poll_options = validated_data.pop('poll_options', None)

        targeted_members = validated_data.pop('targeted_members', None)

        announcement = Announcement.objects.create(**validated_data)

        if poll_question and poll_options:
            poll = Poll.objects.create(
                announcement=announcement,
                question=poll_question
            )
            for option_text in poll_options:
                PollOption.objects.create(poll.poll, text=option_text)

        if targeted_members and not validated_data.get('is_for_all', True):
            announcement.targeted_members.set(targeted_members)

        return announcement