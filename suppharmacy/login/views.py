# -*- coding: utf-8 -*-
import json

from django.http import JsonResponse
from django.shortcuts import render, redirect

from core.models import model


def login_view(request):
    if 'user_id' in request.session:
        return redirect('home')

    if request.method == 'GET':
        return render(request, 'login.html', {})

    if request.method == 'POST':
        data = json.loads(request.body.decode("utf-8"))
        user = model['user'].login(data)

        if user:
            request.session["user_id"] = user['id']
            request.session["user_name"] = user['name']
            return JsonResponse({'ok': True}, status=200)

        return JsonResponse({'ok': False}, status=200)
