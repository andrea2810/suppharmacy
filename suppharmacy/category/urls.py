# -*- coding: utf-8 -*-
from django.urls import path

from category.views import category_list_view, category_form_view

urlpatterns = [
    path('', category_list_view, name='list-category'),
    path('/<int:record>', category_form_view, name='form-category'),
]
