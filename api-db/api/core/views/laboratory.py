# -*- coding: utf-8 -*-

from .base import APIViewList, APIViewDetail

from api.core.models import ResLaboratory
from api.core.serializers import ResLaboratorySerializer


class ResLaboratoryList(APIViewList):
    _model = ResLaboratory
    _serializer = ResLaboratorySerializer


class ResLaboratoryDetail(APIViewDetail):
    _model = ResLaboratory
    _serializer = ResLaboratorySerializer
