# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import Partner

class PartnerSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100, label='Name', required=False)
    last_name = serializers.CharField(max_length=100, label='Last Name',
        required=False)

    def create(self, validated_data):
        instance = Partner(**validated_data)
        instance.create()
        return instance

    def update(self, instance, validated_data):
        instance.update(validated_data)
        for field, value in validated_data.items():
            setattr(instance, field, value)
        return instance
