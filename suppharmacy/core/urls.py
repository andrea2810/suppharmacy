# -*- coding: utf-8 -*-
from django.urls import path

from core.views import home_view, logout_view, login_view

urlpatterns = [
    path('', home_view, name='home'),
    path('login', login_view, name="login"),
    path('logout', logout_view, name="logout"),
]
