from django.urls import path
from .views import (
    EventListView,
    EventDetailView,
    EventCreateView,
    EventUpdateView,
    EventDeleteView,
    EventRSVPView,
)

urlpatterns = [
    path('', EventListView.as_view()),
    path('create/', EventCreateView.as_view()),
    path('<uuid:pk>/', EventDetailView.as_view()),
    path('<uuid:pk>/update/', EventUpdateView.as_view()),
    path('<uuid:pk>/delete/', EventDeleteView.as_view()),
    path('<uuid:pk>/rsvp/', EventRSVPView.as_view()),
]