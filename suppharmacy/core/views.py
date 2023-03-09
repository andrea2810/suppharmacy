# -*- coding: utf-8 -*-
from django.shortcuts import render, redirect

# Create your views here.
def home_view(request):
    # Redirect to login when no have session
    return redirect('login')

    return render(request, 'base.html', {})
