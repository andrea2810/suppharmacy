# -*- coding: utf-8 -*-
from django.urls import path

from stock.views import stock_list_view, stock_form_view

urlpatterns = [
    path('', stock_list_view, name='list-stock'),
    path('/<int:record>', stock_form_view, name='form-stock'),
]
