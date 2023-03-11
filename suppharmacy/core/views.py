# -*- coding: utf-8 -*-
from django.shortcuts import render, redirect

def home_view(request):
    return render(request, 'base.html', {})
