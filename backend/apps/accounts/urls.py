from django.contrib import admin
from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    MeView, CreateFamilyMemberView, FamilyMemberListView,
    FamilyMemberDetailView, FamilyMemberUpdateView,
    FamilyMemberDeleteView, ChangePasswordView,
    LoginView, LogoutView,
)

urlpatterns = [
    path('me/', MeView.as_view()),

    path('members/', FamilyMemberListView.as_view()),
    path('members/create/', CreateFamilyMemberView.as_view()),
    path('members/<uuid:pk>/', FamilyMemberDetailView.as_view()),
    path('members/<uuid:pk>/update/', FamilyMemberUpdateView.as_view()),
    path('members/<uuid:pk>/delete/', FamilyMemberDeleteView.as_view()),

    path('change-password/', ChangePasswordView.as_view()),

    path("login/", LoginView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
]
