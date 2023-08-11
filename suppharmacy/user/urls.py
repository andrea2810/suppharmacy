# -*- coding: utf-8 -*-
from django.urls import path

from user.views import user_list_view, user_form_view

urlpatterns = [
    path('', user_list_view, name='list-user'),
    path('/<int:record>', user_form_view, name='form-user'),
]
