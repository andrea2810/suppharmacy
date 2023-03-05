# -*- coding: utf-8 -*-

from .base import APIViewList, APIViewDetail

from api.core.models import StockPicking
from api.core.serializers import StockPickingSerializer


class StockPickingList(APIViewList):
    _model = StockPicking
    _serializer = StockPickingSerializer


class StockPickingDetail(APIViewDetail):
    _model = StockPicking
    _serializer = StockPickingSerializer
