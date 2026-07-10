from django.urls import path
from .views import (
    AnnouncementListView,
    AnnouncementDetailView,
    AnnouncementCreateView,
    AnnouncementDeleteView,
    AnnouncementReplyCreateView,
    PollVoteView,
)

urlpatterns = [
    path('', AnnouncementListView.as_view()),
    path('create/', AnnouncementCreateView.as_view()),
    path('<uuid:pk>/', AnnouncementDetailView.as_view()),
    path('<uuid:pk>/delete/', AnnouncementDeleteView.as_view()),
    path('<uuid:announcement_id>/replies/create/', AnnouncementReplyCreateView.as_view()),
    path('polls/<int:poll_id>/vote/', PollVoteView.as_view()),
]