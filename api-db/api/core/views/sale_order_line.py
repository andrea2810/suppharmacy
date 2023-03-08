# -*- coding: utf-8 -*-

from .base import APIViewList, APIViewDetail

from api.core.models import SaleOrderLine
from api.core.serializers import SaleOrderLineSerializer


class SaleOrderLineList(APIViewList):
    _model = SaleOrderLine
    _serializer = SaleOrderLineSerializer


class SaleOrderLineDetail(APIViewDetail):
    _model = SaleOrderLine
    _serializer = SaleOrderLineSerializer
