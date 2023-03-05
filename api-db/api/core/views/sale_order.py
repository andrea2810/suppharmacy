# -*- coding: utf-8 -*-

from .base import APIViewList, APIViewDetail

from api.core.models import SaleOrder
from api.core.serializers import SaleOrderSerializer


class SaleOrderList(APIViewList):
    _model = SaleOrder
    _serializer = SaleOrderSerializer


class SaleOrderDetail(APIViewDetail):
    _model = SaleOrder
    _serializer = SaleOrderSerializer
