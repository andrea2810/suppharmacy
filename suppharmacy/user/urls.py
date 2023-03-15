# -*- coding: utf-8 -*-
from django.urls import path

from user.views import user_view, user_data_view

urlpatterns = [
    path('', user_view, name='user'),
    path('/data', user_data_view, name='user-data')
]
