# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import Partner

class PartnerSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100, label='Name', required=True)

    def create(self, validated_data):
        intance = Partner(**validated_data)
        intance.create()
        return intance
