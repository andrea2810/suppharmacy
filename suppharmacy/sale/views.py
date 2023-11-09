# -*- coding: utf-8 -*-
import json

from django.http import JsonResponse
from django.shortcuts import render, redirect

from core.models import model

def sale_list_view(request):
    return render(request, 'sale/list.html', {})

def sale_form_view(request, record):
    data = {}

    if record != 0:
        data = model['sale-order'].browse(record)

        if not data:
            return redirect('list-sale')

    return render(request, 'sale/form.html', data)
