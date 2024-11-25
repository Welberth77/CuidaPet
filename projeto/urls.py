
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('login.urls')),
    path('login/', include('login.urls')),
    path('cadastro/', include('login.urls')),
    path('inicio/', include('login.urls')),
    path('sobre/', include('login.urls')),
    path('registrar banho/', include('login.urls')),
    path('meus pets/', include('login.urls')),
    path('cadastrar pet/', include('login.urls')),
    path('banho e tosa/', include('login.urls')),
    path('medicamentos e vacinas/', include('login.urls')),
    path('registrar medicamento/', include('login.urls')),
    path('rotina/', include('login.urls')),
    path('registrar nova rotina/', include('login.urls')),
    path('petshops/', include('login.urls')),
    path('editar perfil/', include('login.urls')),
    path('petshops/', include('login.urls')),
    path('editar perfil/', include('login.urls')),
    path('perfil usuario/', include('login.urls')),
    path('noticias/', include('login.urls')),
    path('noticia unica/', include('login.urls')),
    path('registrar vacina/', include('login.urls')),
    


]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
