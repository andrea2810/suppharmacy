# -*- coding: utf-8 -*-
from django.urls import path

from product.views import product_list_view, product_form_view

urlpatterns = [
    path('', product_list_view, name='list-product'),
    path('/<int:record>', product_form_view, name='form-product'),
]
