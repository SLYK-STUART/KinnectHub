from django.contrib import admin
from .models import WallPost, WallReply


@admin.register(WallPost)
class WallPostAdmin(admin.ModelAdmin):
    list_display = ('author', 'post_type', 'created_at')
    list_filter = ('post_type', 'created_at')
    search_fields = ('message', 'author__full_name')
    raw_id_fields = ('family', 'author')


@admin.register(WallReply)
class WallReplyAdmin(admin.ModelAdmin):
    list_display = ('post', 'author', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('message', 'author__full_name')
    raw_id_fields = ('post', 'author')