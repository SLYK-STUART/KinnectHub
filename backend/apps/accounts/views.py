from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.filters import SearchFilter

from rest_framework_simplejwt.tokens import RefreshToken

from.models import FamilyMember

from .serializers import (
    FamilyMemberSerializer,
    CreateFamilyMemberSerializer,
    ChangePasswordSerializer,
    LoginSerializer, UpdateFamilyMemberSerializer,
)
from .permissions import IsAdminUser

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = FamilyMemberSerializer(request.user)
        return Response(serializer.data)
    
class CreateFamilyMemberView(generics.CreateAPIView):
    queryset = FamilyMember.objects.all()
    serializer_class = CreateFamilyMemberSerializer
    permission_classes = [IsAdminUser]

class FamilyMemberListView(generics.ListAPIView):
    queryset = FamilyMember.objects.all()
    serializer_class = FamilyMemberSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [SearchFilter]
    search_fields = ['full_name', 'email']
    filterset_fields = ['family_role']

class FamilyMemberDetailView(generics.RetrieveAPIView):
    queryset = FamilyMember.objects.all()
    serializer_class = FamilyMemberSerializer
    permission_classes = [IsAuthenticated]

class FamilyMemberUpdateView(generics.UpdateAPIView):
    serializer_class = UpdateFamilyMemberSerializer
    queryset = FamilyMember.objects.all()
    serializer_class = CreateFamilyMemberSerializer
    permission_classes = [IsAdminUser]

class FamilyMemberDeleteView(generics.DestroyAPIView):
    queryset = FamilyMember.objects.all()
    permission_classes = [IsAdminUser]

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        user = request.user

        if not user.check_password(
            serializer.validated_data['old_password']
        ):
            return Response(
                {"detail": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        from django.utils.timezone import now
        user.set_password(
            serializer.validated_data['new_password']
        )

        user.must_change_password = False
        user.last_password_change = now()
        user.save()

        return Response(
            {"detail": "Password changes successfully."},
            status=status.HTTP_200_OK
        )
    
class LoginView(APIView):

    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        user.update_last_seen()

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "must_change_password": user.must_change_password,
            "user": {
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "is_admin": user.is_admin,
            }
        })
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"detail": "Logged out successfully."}
            )

        except Exception:
            return Response(
                {"detail": "Invalid token."},
                status=status.HTTP_400_BAD_REQUEST
            )