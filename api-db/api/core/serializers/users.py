# -*- coding: utf-8 -*-

from rest_framework import serializers

from .base import APISerializer
from api.core.models import ResUsers

class ResUsersSerializer(APISerializer):
    _model = ResUsers

    id = serializers.IntegerField(read_only=True)
    active = serializers.BooleanField(required=False)
    name = serializers.CharField(max_length=50, label='Name', required=False)
    username = serializers.CharField(max_length=50, required=False)
    password = serializers.CharField(max_length=50, required=False)