# -*- coding: utf-8 -*-
from django.http import JsonResponse
from django.shortcuts import render, redirect

def home_view(request):
    return render(request, 'home.html', {})

def logout_view(request):
    try:
        del request.session['user_id']
        del request.session['user_name']
    except KeyError:
        pass

    return JsonResponse({}, status=200)
