# -*- coding: utf-8 -*-
import json

from django.http import JsonResponse
from django.shortcuts import render, redirect

from core.models import model

def picking_list_view(request):
    return render(request, 'picking/list.html', {})

def picking_form_view(request, record):
    data = {}

    if record != 0:
        data = model['picking-picking'].browse(record)

        if not data:
            return redirect('list-picking')

    return render(request, 'picking/form.html', data)

def quant_list_view(request):
    return render(request, 'quant/list.html', {})
