from django.urls import path
from .views import (
    MemoryItemListCreateView,
    MemoryItemDetailView,
    MemoryDeletionRequestListCreateView,
    MemoryDeletionRequestReviewView,
)

urlpatterns = [
    path('', MemoryItemListCreateView.as_view()),
    path('<uuid:id>/', MemoryItemDetailView.as_view()),
    path('deletion-requests/', MemoryDeletionRequestListCreateView.as_view()),
    path('deletion-requests/<uuid:id>/review/', MemoryDeletionRequestReviewView.as_view()),
]