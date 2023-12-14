# -*- coding: utf-8 -*-

from rest_framework import serializers

from .base import APISerializer
from api.core.models import StockMove

class StockMoveSerializer(APISerializer):
    _model = StockMove

    id = serializers.IntegerField(read_only=True)
    date = serializers.DateField(required=False)
    name = serializers.CharField(max_length=100, label='Name', required=False)
    origin = serializers.CharField(max_length=100, required=False)
    picking_id = serializers.IntegerField(required=False)
    product_id = serializers.IntegerField(required=False)
    product_qty = serializers.IntegerField()
    lot_number = serializers.CharField(max_length=100, required=False)
    expiration_time = serializers.DateField(required=False)
