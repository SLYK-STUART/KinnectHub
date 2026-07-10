from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentication
    path('api/auth/',include('apps.accounts.urls')),
    path('api/family-tree/', include('apps.family_tree.urls')),
    path('api/announcements/', include('apps.announcements.urls')),
    path('api/profiles/', include('apps.profiles.urls')),
    path('api/location/', include('apps.location.urls')),
    path('api/vault/', include('apps.vault.urls')),
    path('api/memory/', include('apps.memory_book.urls')),
    path('api/calendar/', include('apps.family_calendar.urls')),
    path('api/wall/', include('apps.wall.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
