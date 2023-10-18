# -*- coding: utf-8 -*-
import json

from django.http import JsonResponse
from django.shortcuts import render, redirect

from core.models import model

def partner_list_view(request):
    return render(request, 'partner/list.html', {})

def partner_form_view(request, record):
    data = {}

    if record != 0:
        data = model['partner'].browse(record)

        if not data['ok'] or not data['data']:
            return redirect('list-partner')

        data = data['data']

    return render(request, 'partner/form.html', data)
