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
    sale_id = serializers.IntegerField(required=False)
    purchase_id = serializers.IntegerField(required=False)
    picking_id = serializers.IntegerField(required=False)
    quantity_done = serializers.IntegerField()
    product_qty = serializers.IntegerField()
    state = serializers.CharField(required=False, max_length=20)
