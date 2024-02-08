# -*- coding: utf-8 -*-
import json

from django.http import JsonResponse
from django.shortcuts import render, redirect

from core.models import model

def product_list_view(request):
    return render(request, 'product/list.html', {})

def product_form_view(request, record):
    data = {}

    if record != 0:
        data = model['product'].browse(record)

        if not data:
            return redirect('list-product')

    return render(request, 'product/form.html', data)
