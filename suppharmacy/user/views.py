# -*- coding: utf-8 -*-
import json

from django.http import JsonResponse
from django.shortcuts import render, redirect

from core.models import model

def user_view(request):
    return render(request, 'user/list.html', {})
