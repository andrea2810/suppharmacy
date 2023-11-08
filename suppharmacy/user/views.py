# -*- coding: utf-8 -*-
import json

from django.http import JsonResponse
from django.shortcuts import render, redirect

from core.models import model

def user_list_view(request):
    return render(request, 'user/list.html', {})

def user_form_view(request, record):
    data = {}

    if record != 0:
        data = model['user'].browse(record)

        if not data:
            return redirect('list-user')

    return render(request, 'user/form.html', data)
