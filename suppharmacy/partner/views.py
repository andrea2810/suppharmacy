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

        if not data:
            return redirect('list-partner')

    return render(request, 'partner/form.html', data)
