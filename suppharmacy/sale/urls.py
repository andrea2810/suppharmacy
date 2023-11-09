# -*- coding: utf-8 -*-
from django.urls import path

from sale.views import sale_list_view, sale_form_view

urlpatterns = [
    path('', sale_list_view, name='list-sale'),
    path('/<int:record>', sale_form_view, name='form-sale'),
]
