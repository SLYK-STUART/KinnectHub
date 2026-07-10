from django.urls import path
from .views import (
    LocationShareListView,
    LocationShareCreateView,
    LocationShareDeactivateView,
    SOSAlertListView,
    SOSAlertCreateView,
    SOSAlertResolveView,
    SafetyResponseCreateView,
)

urlpatterns = [
    path('shares/', LocationShareListView.as_view()),
    path('shares/create/', LocationShareCreateView.as_view()),
    path('shares/<uuid:pk>/deactivate/', LocationShareDeactivateView.as_view()),

    path('sos/', SOSAlertListView.as_view()),
    path('sos/create/', SOSAlertCreateView.as_view()),
    path('sos/<uuid:pk>/resolve/', SOSAlertResolveView.as_view()),
    path('sos/<uuid:sos_id>/respond/', SafetyResponseCreateView.as_view()),
]