# -*- coding: utf-8 -*-
import json

from django.http import JsonResponse
from django.shortcuts import render, redirect

from core.models import model

def category_list_view(request):
    return render(request, 'category/list.html', {})

def category_form_view(request, record):
    data = {}

    if record != 0:
        data = model['drug-category'].browse(record)

        if not data:
            return redirect('list-category')

    return render(request, 'category/form.html', data)
