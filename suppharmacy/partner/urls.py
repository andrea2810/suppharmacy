# -*- coding: utf-8 -*-
from django.urls import path

from partner.views import partner_list_view, partner_form_view

urlpatterns = [
    path('', partner_list_view, name='list-partner'),
    path('/<int:record>', partner_form_view, name='form-partner'),
]
