# -*- coding: utf-8 -*-
import json

from django.http import JsonResponse
from django.shortcuts import render, redirect

from core.models import model

def purchase_list_view(request):
    return render(request, 'purchase/list.html', {})

def purchase_form_view(request, record):
    data = {}

    if record != 0:
        data = model['purchase-order'].browse(record)

        if not data:
            return redirect('list-purchase')

    return render(request, 'purchase/form.html', data)
