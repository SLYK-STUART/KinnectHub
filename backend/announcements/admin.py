from django.contrib import admin
from .models import Announcement, AnnouncementReply, Poll, PollOption

# Register your models here.
@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'is_urgent', 'is_for_all', 'created_at')
    list_filter = ('is_urgent', 'is_for_all', 'created_at')
    search_fields = ('title', 'message', 'author__full_name')
    raw_id_fields = ('author', 'targeted_members')

@admin.register(AnnouncementReply)
class AnnouncementReplyAdmin(admin.ModelAdmin):
    list_display = ('announcement', 'author', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('message', 'author__full_name')

admin.site.register(Poll)
admin.site.register(PollOption)