# -*- coding: utf-8 -*-

from rest_framework import serializers

from .base import APISerializer
from api.core.models import DrugCategory

class DrugCategorySerializer(APISerializer):
    _model = DrugCategory

    id = serializers.IntegerField(read_only=True)
    active = serializers.BooleanField(required=False)
    name = serializers.CharField(max_length=50, label='Name', required=False)