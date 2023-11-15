# -*- coding: utf-8 -*-
from django.urls import path

from stock.views import picking_list_view, picking_form_view, quant_list_view

urlpatterns = [
    path('', picking_list_view, name='list-picking'),
    path('/<int:record>', picking_form_view, name='form-picking'),
    path('/quant', quant_list_view, name='list-quant'),
]
