# -*- coding: utf-8 -*-
from django.urls import path

from laboratory.views import laboratory_list_view, laboratory_form_view

urlpatterns = [
    path('', laboratory_list_view, name='list-laboratory'),
    path('/<int:record>', laboratory_form_view, name='form-laboratory'),
]
