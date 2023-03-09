# -*- coding: utf-8 -*-
from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.

def login_view(request):
    if request.method == 'GET':
        return render(request, 'login.html', {})

    if request.method == 'POST':
        # TODO connect with the DB through api-db
        print(request.body)
        return JsonResponse({'logged_in': True})
