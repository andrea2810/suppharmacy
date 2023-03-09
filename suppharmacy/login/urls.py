# -*- coding: utf-8 -*-
from django.urls import path

from login.views import login_view

urlpatterns = [
    path('', login_view, name='login'),
]
