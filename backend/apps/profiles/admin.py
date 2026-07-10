from django.contrib import admin
from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('member', 'blood_type', 'nin', 'updated_at')
    list_filter = ('blood_type',)
    search_fields = ('member__full_name', 'nin', 'phone_number')
    raw_id_fields = ('member',)
    
    fieldsets = (
        ("Personal Information", {
            'fields': ('member', 'photo', 'cover_photo', 'date_of_birth', 'occupation', 'bio')
        }),
        ("Identification", {
            'fields': ('nin',)
        }),
        ("Contact", {
            'fields': ('phone_number', 'secondary_phone', 'address', 
                      'emergency_contact_name', 'emergency_contact_phone')
        }),
        ("Medical Information", {
            'fields': ('blood_type', 'allergies', 'medical_notes')
        }),
    )