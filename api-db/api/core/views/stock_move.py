# -*- coding: utf-8 -*-

from .base import APIViewList, APIViewDetail

from api.core.models import StockMove
from api.core.serializers import StockMoveSerializer


class StockMoveList(APIViewList):
    _model = StockMove
    _serializer = StockMoveSerializer


class StockMoveDetail(APIViewDetail):
    _model = StockMove
    _serializer = StockMoveSerializer
