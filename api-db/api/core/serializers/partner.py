# -*- coding: utf-8 -*-

from rest_framework import serializers

from .base import APISerializer
from api.core.models import Partner

class PartnerSerializer(APISerializer):
    _model = Partner

    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100, label='Name', required=False)
    last_name = serializers.CharField(max_length=100, label='Last Name',
        required=False)
