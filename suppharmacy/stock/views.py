# -*- coding: utf-8 -*-
import json

from django.http import JsonResponse
from django.shortcuts import render, redirect

from core.models import model

def stock_list_view(request):
    return render(request, 'picking/list.html', {})

def stock_form_view(request, record):
    data = {}

    if record != 0:
        data = model['stock-picking'].browse(record)

        if not data:
            return redirect('list-stock')

    return render(request, 'picking/form.html', data)
