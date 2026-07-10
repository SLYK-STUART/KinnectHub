from django.urls import path

from .views import (
    WallPostDetailView,
    WallPostListCreateView,
    WallPostReactionView,
    WallReplyCreateView,
    WallReplyDeleteView,
)

urlpatterns = [
    path('', WallPostListCreateView.as_view()),
    path('<uuid:pk>/', WallPostDetailView.as_view()),
    path('<uuid:pk>/react/', WallPostReactionView.as_view()),
    path('<uuid:post_id>/replies/create/', WallReplyCreateView.as_view()),
    path('replies/<uuid:pk>/delete/', WallReplyDeleteView.as_view()),
]
