from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from firebase_admin import auth as firebase_auth
from .models import FamilyMember
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.authentication import JWTAuthentication

class FirebaseAuthentication(BaseAuthentication):
    """
    Autheticates requests using Firebase ID token.
    Expects header: Authorization: Bearer <firebase_id_token>
    """


    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        
        id_token = auth_header.split(' ')[1]

        try:
            decode_token = firebase_auth.verify_id_token(id_token)
        except Exception:
            raise AuthenticationFailed('Invalid or expired Firebase Token.')
        
        firebase_uid = decode_token.get('uid')
        email = decode_token.get('email')

        if not firebase_uid:
            raise AuthenticationFailed('Firebase token missing UID.')
        
        try:
            user = FamilyMember.objects.get(firebase_uid=firebase_uid)
            return (user, None)
        except FamilyMember.DoesNotExist:
            pass

        if email:
            try:
                user = FamilyMember.objects.get(email=email)
                user.firebase_uid = firebase_uid
                user.save(update_fields=['firebase_uid'])
                return (user, None)
            except FamilyMember.DoesNotExist:
                pass

        raise AuthenticationFailed(
            'No account found for this user. Ask an admin to add you first.'
        )
    
class LenientJWTAuthentication(JWTAuthentication):
    """
    if the token isn't a valid django issues JWT, returns None instead
    of raising errors, so DRF moves on to try FirebaseAuthentication next
    """

    def authenticate(self, request):
        try:
            return super().authenticate(request)
        except (InvalidToken, TokenError):
            return None