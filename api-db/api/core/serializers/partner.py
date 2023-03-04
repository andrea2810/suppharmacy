# -*- coding: utf-8 -*-

from rest_framework import serializers

from .base import APISerializer
from api.core.models import Partner

class PartnerSerializer(APISerializer):
    _model = Partner

    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100, label='Name', required=False)
    active = serializers.BooleanField(required=False)
    birth_date = serializers.DateField(required=False)
    city = serializers.CharField(max_length=100, required=False)
    country = serializers.CharField(max_length=100, required=False)
    email = serializers.CharField(max_length=100, required=False)
    is_company = serializers.BooleanField(required=False)
    mobile = serializers.CharField(max_length=15, required=False)
    phone = serializers.CharField(max_length=15, required=False)
    ref = serializers.CharField(max_length=100, required=False)
    rfc = serializers.CharField(max_length=15, required=False)
    cp = serializers.CharField(max_length=5, required=False)