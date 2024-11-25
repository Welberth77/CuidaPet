from django.urls import path
from . import views



urlpatterns = [
    path('', views.login, name='login'),
    path('login/', views.login, name='login'),
    path('cadastro/', views.cadastro, name='cadastro'),
    path('inicio/', views.inicio, name='inicio'),
    path('sobre/', views.sobre, name='sobre nos'),
    path('registrar banho/', views.registrar_novo_banho, name='registrar banho'),
    path('meus pets/', views.meus_pets, name='meus pets'),
    path('cadastrar pet/', views.cadastrar_pet, name='cadastrar pet'),
    path('banho e tosa/', views.banho_e_tosa, name='banho e tosa'),
    path('medicamentos e vacinas/', views.medicamentos_e_vacinas, name='medicamentos e vacinas'),
    path('registrar medicamento/', views.registrar_medicamento, name='registrar medicamento'),
    path('rotina/', views.login, name='rotina'),
    path('registrar nova rotina/', views.registrar_nova_rotina, name='registrar nova rotina'),
    path('petshops/', views.petshops, name='petshops'),
    path('editar perfil/', views.editar_perfil, name='editar perfil'),
    path('perfil usuario/', views.perfil_usuario, name='perfil usuario'),
    path('noticias/', views.noticias, name='noticias'),
    path('noticia unica/', views.noticia_unica, name='noticia unica'),
    path('registrar vacina/', views.registrar_nova_vacina, name='registrar vacina'),


]
