# -*- coding: utf-8 -*-
import json

from django.http import JsonResponse
from django.shortcuts import render, redirect

from core.models import model

def laboratory_list_view(request):
    return render(request, 'laboratory/list.html', {})

def laboratory_form_view(request, record):
    data = {}

    if record != 0:
        data = model['laboratory'].browse(record)

        if not data['ok'] or not data['data']:
            return redirect('list-laboratory')

        data = data['data']

    return render(request, 'laboratory/form.html', data)
