# -*- coding: utf-8 -*-
from django.urls import path

from purchase.views import purchase_list_view, purchase_form_view

urlpatterns = [
    path('', purchase_list_view, name='list-purchase'),
    path('/<int:record>', purchase_form_view, name='form-purchase'),
]
