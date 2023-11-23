# -*- coding: utf-8 -*-

from rest_framework import serializers

from .base import APISerializer
from api.core.models import ProductProduct

class ProductProductSerializer(APISerializer):
    _model = ProductProduct

    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100, label='Name', required=False)
    active = serializers.BooleanField(required=False)
    code = serializers.CharField(max_length=15, required=False)
    dealer_price = serializers.FloatField(required=False)
    description = serializers.CharField(max_length=150, required=False)
    list_price = serializers.FloatField(required=False)
    name = serializers.CharField(max_length=100, required=False)
    sale_ok = serializers.BooleanField(required=False)
    taxes = serializers.FloatField(required=False)
    presentation = serializers.CharField(max_length=100, required=False)
    laboratory_id = serializers.IntegerField(required=False)
    drug_category_id = serializers.IntegerField(required=False)
    is_antibiotic= serializers.BooleanField(required=False)