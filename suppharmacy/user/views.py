# -*- coding: utf-8 -*-
import json

from django.http import JsonResponse
from django.shortcuts import render, redirect

from core.models import model

def user_view(request):
    return render(request, 'user/list.html', {})

def user_data_view(request):
    data = json.loads(request.body.decode("utf-8") or '{}')

    if request.method == 'GET':
        return JsonResponse(model['user'].get())
