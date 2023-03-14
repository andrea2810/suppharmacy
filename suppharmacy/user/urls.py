# -*- coding: utf-8 -*-
from django.urls import path

from user.views import user_view

urlpatterns = [
    path('', user_view, name='user'),
]
