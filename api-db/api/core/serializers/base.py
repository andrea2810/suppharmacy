# -*- coding: utf-8 -*-

from rest_framework import serializers

class APISerializer(serializers.Serializer):

    _model = None

    def create(self, validated_data):
        instance = self._model(**validated_data)
        instance.create()

        return instance

    def update(self, instance, validated_data):
        instance.update(validated_data)

        for field, value in validated_data.items():
            setattr(instance, field, value)

        return instance
