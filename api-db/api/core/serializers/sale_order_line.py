# -*- coding: utf-8 -*-

from rest_framework import serializers

from .base import APISerializer
from api.core.models import SaleOrderLine

class SaleOrderLineSerializer(APISerializer):
    _model = SaleOrderLine

    id = serializers.IntegerField(read_only=True)
    order_id = serializers.IntegerField(required=False)
    price_total = serializers.FloatField(required=False)
    price_unit = serializers.FloatField(required=False)
    product_id = serializers.IntegerField(required=False)
    product_qty = serializers.FloatField(required=False)