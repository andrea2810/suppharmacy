# -*- coding: utf-8 -*-
import json

from django.http import JsonResponse
from django.shortcuts import render

from core.models import model


def login_view(request):
    if request.method == 'GET':
        return render(request, 'login.html', {})

    if request.method == 'POST':
        data = json.loads(request.body.decode("utf-8"))

        print(model['user'])
        print(model['user'].get([
            ['username', '=', data.get('user', '')],
            'AND', ['password', '=', data.get('password', '')]
        ], count=False))

        # if not 'user_id' in request.session:
        #     request.session["user_id"] = 1
        return JsonResponse({'logged_in': True})
