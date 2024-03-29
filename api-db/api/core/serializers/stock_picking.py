# -*- coding: utf-8 -*-

from rest_framework import serializers

from .base import APISerializer
from api.core.models import StockPicking

class StockPickingSerializer(APISerializer):
    _model = StockPicking

    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100, label='Name', required=False)
    date = serializers.DateField(required=False)
    partner_id = serializers.IntegerField(required=False)
    sale_id = serializers.IntegerField(required=False, allow_null=True)
    purchase_id = serializers.IntegerField(required=False, allow_null=True)
    state = serializers.CharField(required=False, allow_blank=True, max_length=20)
    type_picking = serializers.CharField(required=False, allow_blank=True,
        max_length=50)
    user_id = serializers.IntegerField(required=False)