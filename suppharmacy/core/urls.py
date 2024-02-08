# -*- coding: utf-8 -*-
from django.urls import path

from core.views import home_view, logout_view, login_view, dataset_view, dataset_call_view

urlpatterns = [
    path('', home_view, name='home'),
    path('login', login_view, name="login"),
    path('logout', logout_view, name="logout"),
    path('dataset/<str:table>', dataset_view, name="dataset"),
    path('dataset/call/<str:table>', dataset_call_view, name="dataset-call"),
]
