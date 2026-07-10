from django.urls import path
from .views import (
    FullFamilyTreeView,
    FamilyTreeNodeListView,
    FamilyTreeNodeDetailView,
    FamilyTreeNodeCreateView,
    FamilyTreeNodeUpdateView,
    FamilyTreeNodeDeleteView,
    FamilyRelationshipListView,
    FamilyRelationshipCreateView,
    FamilyRelationshipDeleteView,
)

urlpatterns = [
    path('', FullFamilyTreeView.as_view()),

    path('nodes/', FamilyTreeNodeListView.as_view()),
    path('nodes/create/', FamilyTreeNodeCreateView.as_view()),
    path('nodes/<uuid:pk>/', FamilyTreeNodeDetailView.as_view()),
    path('nodes/<uuid:pk>/update/', FamilyTreeNodeUpdateView.as_view()),
    path('nodes/<uuid:pk>/delete/', FamilyTreeNodeDeleteView.as_view()),

    path('relationships/', FamilyRelationshipListView.as_view()),
    path('relationships/create/', FamilyRelationshipCreateView.as_view()),
    path('relationships/<uuid:pk>/delete/', FamilyRelationshipDeleteView.as_view()),
]