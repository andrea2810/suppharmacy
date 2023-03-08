# -*- coding: utf-8 -*-

from .base import APIViewList, APIViewDetail

from api.core.models import StockQuant
from api.core.serializers import StockQuantSerializer


class StockQuantList(APIViewList):
    _model = StockQuant
    _serializer = StockQuantSerializer


class StockQuantDetail(APIViewDetail):
    _model = StockQuant
    _serializer = StockQuantSerializer
