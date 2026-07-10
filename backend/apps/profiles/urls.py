from django.urls import path
from .views import (
    ProfileListView,
    MyProfileView,
    ProfileDetailView,
    ProfileUpdateView,
)

urlpatterns = [
    path('', ProfileListView.as_view()),
    path('me/', MyProfileView.as_view()),
    path('<uuid:pk>/', ProfileDetailView.as_view()),
    path('<uuid:pk>/update/', ProfileUpdateView.as_view()),
]