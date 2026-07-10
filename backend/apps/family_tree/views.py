from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.permissions import IsAdminUser

from .models import Family, FamilyMember, FamilyTreeNode, FamilyRelationship
from.serializers import (
    FamilyTreeNodeSerializer,
    FamilyTreeNodeCreateSerializer,
    FamilyTreeNodeUpdateSerializer,
    FamilyRelationshipSerializer,
    FamilyRelationshipCreateSerializer,
    FullFamilyTreeSerializer,
)

class FullFamilyTreeView(APIView):
    """
    single response with everything neede to render the whole tree:
    family info + all nodes + all relationships
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        family = Family.objects.first()

        if family is None:
            return Response(
                {"detail": "No family has been set up yet."},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        nodes = family.tree_nodes.select_related('member').all()
        relationships = FamilyRelationship.objects.filter(
            from_node__family=family
        ).select_related('from_node__member', 'to_node__member')

        data = {
            'family': family,
            'nodes': nodes,
            'relationships': relationships,
        }

        serializer = FullFamilyTreeSerializer(data)
        return Response(serializer.data)
    
class FamilyTreeNodeListView(generics.ListAPIView):
    queryset = FamilyTreeNode.objects.select_related('member', 'family')
    serializer_class = FamilyTreeNodeSerializer
    permission_classes = [IsAuthenticated]

class FamilyTreeNodeDetailView(generics.RetrieveAPIView):
    queryset = FamilyTreeNode.objects.select_related('member', 'family')
    serializer_class = FamilyTreeNodeSerializer
    permission_classes = [IsAuthenticated]

class FamilyTreeNodeCreateView(generics.CreateAPIView):
    queryset = FamilyTreeNode.objects.all()
    serializer_class = FamilyTreeNodeCreateSerializer
    permission_classes = [IsAdminUser]

class FamilyTreeNodeUpdateView(generics.UpdateAPIView):
    queryset = FamilyTreeNode.objects.all()
    serializer_class = FamilyTreeNodeUpdateSerializer
    permission_classes = [IsAdminUser]

class FamilyTreeNodeDeleteView(generics.DestroyAPIView):
    queryset = FamilyTreeNode.objects.all()
    permission_classes = [IsAdminUser]

class FamilyRelationshipListView(generics.ListAPIView):
    queryset = FamilyRelationship.objects.select_related(
        'from_node', 'to_node'
    ).all()
    serializer_class = FamilyRelationshipSerializer
    permission_classes = [IsAuthenticated]

class FamilyRelationshipCreateView(generics.CreateAPIView):
    queryset = FamilyRelationship.objects.all()
    serializer_class = FamilyRelationshipCreateSerializer
    permission_classes = [IsAdminUser]

class FamilyRelationshipDeleteView(generics.RetrieveDestroyAPIView):
    queryset = FamilyRelationship.objects.all()
    permission_classes = [IsAdminUser]