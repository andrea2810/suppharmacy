# -*- coding: utf-8 -*-

from rest_framework import serializers

from .base import APISerializer
from api.core.models import PurchaseOrder

class PurchaseOrderSerializer(APISerializer):
    _model = PurchaseOrder

    id = serializers.IntegerField(read_only=True)
    active = serializers.BooleanField(required=False)
    amount_total = serializers.FloatField(required=False)
    date = serializers.DateField(required=False)
    name = serializers.CharField(
        required=False,
        max_length=100)
    partner_id = serializers.IntegerField(required=False)
    state = serializers.CharField(
        required=False,
        max_length=20)
    user_id = serializers.IntegerField(required=False)