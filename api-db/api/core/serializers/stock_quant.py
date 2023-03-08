# -*- coding: utf-8 -*-

from rest_framework import serializers

from .base import APISerializer
from api.core.models import StockQuant

class StockQuantSerializer(APISerializer):
    _model = StockQuant

    id = serializers.IntegerField(read_only=True)
    available_quantity = serializers.FloatField(required=False)
    in_date = serializers.DateField(required=False)
    product_id = serializers.IntegerField(required=False)
    quantity = serializers.FloatField(required=False)