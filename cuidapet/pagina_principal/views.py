from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required  # Exige que o usuário esteja logado
def home(request):
    return render(request, 'pagina_principal/pagina_principal.html')
