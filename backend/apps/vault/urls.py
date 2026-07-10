from django.urls import path
from .views import (
    VaultCategoryListView,
    VaultCategoryCreateView,
    VaultCategoryDeleteView,
    VaultCategorySetPasscodeView,
    VaultCategoryUnlockView,
    VaultDocumentListView,
    VaultDocumentDetailView,
    VaultDocumentCreateView,
    VaultDocumentUpdateView,
    VaultDocumentDeleteView,
)

urlpatterns = [
    path('categories/', VaultCategoryListView.as_view()),
    path('categories/create/', VaultCategoryCreateView.as_view()),
    path('categories/<uuid:pk>/delete/', VaultCategoryDeleteView.as_view()),
    path('categories/<uuid:pk>/set-passcode/', VaultCategorySetPasscodeView.as_view()),
    path('categories/<uuid:pk>/unlock/', VaultCategoryUnlockView.as_view()),

    path('documents/', VaultDocumentListView.as_view()),
    path('documents/create/', VaultDocumentCreateView.as_view()),
    path('documents/<uuid:pk>/', VaultDocumentDetailView.as_view()),
    path('documents/<uuid:pk>/update/', VaultDocumentUpdateView.as_view()),
    path('documents/<uuid:pk>/delete/', VaultDocumentDeleteView.as_view()),
]