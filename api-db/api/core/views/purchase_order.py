# -*- coding: utf-8 -*-

from .base import APIViewList, APIViewDetail

from api.core.models import PurchaseOrder
from api.core.serializers import PurchaseOrderSerializer


class PurchaseOrderList(APIViewList):
    _model = PurchaseOrder
    _serializer = PurchaseOrderSerializer


class PurchaseOrderDetail(APIViewDetail):
    _model = PurchaseOrder
    _serializer = PurchaseOrderSerializer
