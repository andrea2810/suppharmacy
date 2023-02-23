# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import Partner

class PartnerSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100, label='Name', required=True)

    def create(self, validated_data):
        return Partner(**validated_data)
