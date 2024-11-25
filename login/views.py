from django.shortcuts import render



def login(request):
    print('login')
    return render(request, 'index.html')

def cadastro(request):
    print('cadastro')
    return render(request, 'cadastrar_usuario.html')

def inicio(request):
    print('inicio')
    return render(request, 'pagina_principal.html')

def sobre(request):
    print('sobre')
    return render(request, 'sobre_nos.html')

def registrar_novo_banho(request):
    print('registrar_novo_banho')
    return render(request, 'registrar_novo_banho.html')

def meus_pets(request):
    print('meus_pets')
    return render(request, 'meus_pets.html')

def cadastrar_pet(request):
    print('cadastrar_pet')
    return render(request, 'cadastrar_pet.html')

def banho_e_tosa(request):
    print('banho_e_tosa')
    return render(request, 'banho_e_tosa.html')

def registrar_medicamento(request):
    print('registrar_medicamento')
    return render(request, 'registrar_medicamento.html')

def medicamentos_e_vacinas(request):
    print('medicamentos_e_vacinas')
    return render(request, 'medicamentos_e_vacinas.html')

def rotina(request):
    print('rotina')
    return render(request, 'rotina.html')

def registrar_nova_rotina(request):
    print('registrar_nova_rotina')
    return render(request, 'registrar_nova_rotina.html')

def petshops(request):
    print('petshops')
    return render(request, 'petshops.html')

def editar_perfil(request):
    print('editar_perfil')
    return render(request, 'editar_perfil.html')

def perfil_usuario(request):
    print('perfil_usuario')
    return render(request, 'perfil_usuario.html')

def noticias(request):
    print('noticias')
    return render(request, 'noticias.html')

def noticia_unica(request):
    print('noticia_unica')
    return render(request, 'noticia_unica.html')

def registrar_nova_vacina(request):
    print('registrar_nova_vacina')
    return render(request, 'registrar_nova_vacina.html')