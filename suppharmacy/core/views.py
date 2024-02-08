# -*- coding: utf-8 -*-
import json

from django.http import JsonResponse
from django.shortcuts import render, redirect

from core.models import model

def home_view(request):
    return render(request, 'home.html', {})

def login_view(request):
    if 'user_id' in request.session:
        return redirect('home')

    if request.method == 'GET':
        return render(request, 'login.html', {})

    if request.method == 'POST':
        data = {}
        try:
            data = json.loads(request.body.decode("utf-8"))
        except:
            return JsonResponse({'ok': False, 'error': "Bad Body"})
        user = model['user'].login(data)

        if user:
            request.session["user_id"] = user['id']
            request.session["user_name"] = user['name']
            return JsonResponse({'ok': True}, status=200)

        return JsonResponse({'ok': False}, status=200)

def logout_view(request):
    try:
        del request.session['user_id']
        del request.session['user_name']
    except KeyError:
        pass

    return JsonResponse({}, status=200)

def dataset_view(request, table, **params):
    if table not in model:
        raise Exception(f"Model {table} is not defined")

    if request.method == 'GET':
        fields = request.GET.get('fields', [])

        if fields:
            fields = fields.split(',')

        return model[table].get(
            args=json.loads(request.GET.get('args', '[]')),
            count=bool(request.GET.get('count', 0)),
            order=request.GET.get('order', "id ASC"),
            limit=int(request.GET.get('limit', 80)),
            offset=int(request.GET.get('offset', 0)),
            fields=fields
        )

    if request.method == 'POST':
        data = {}
        try:
            data = json.loads(request.body.decode("utf-8"))
        except:
            raise Exception("Bad Body")

        return model[table].create(data)

    if request.method == 'PUT':
        data = {}
        try:
            data = json.loads(request.body.decode("utf-8"))
        except:
            raise Exception("Bad Body")

        return model[table].update(data)

    if request.method == 'DELETE':
        data = {}
        try:
            data = json.loads(request.body.decode("utf-8"))
        except:
            raise Exception("Bad Body")

        return model[table].delete([data['id']])

    raise Exception("Method not allow")

def dataset_call_view(request, table, **params):
    if table not in model:
        raise Exception(f"Model {table} is not defined")

    if request.method != 'POST':
        raise Exception("Method not allow")

    data = {}
    try:
        data = json.loads(request.body.decode("utf-8"))
    except:
        raise Exception("Bad Body")

    if not 'method' in data or not 'args' in data:
        raise Exception("Missing fields in body")

    if not isinstance(data['args'], list):
        raise Exception("Parameters must be a list")

    return getattr(model[table], data['method'])(*data['args'])
