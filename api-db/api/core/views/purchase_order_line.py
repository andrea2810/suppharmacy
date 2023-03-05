# -*- coding: utf-8 -*-

from .base import APIViewList, APIViewDetail

from api.core.models import PurchaseOrderLine
from api.core.serializers import PurchaseOrderLineSerializer


class PurchaseOrderLineList(APIViewList):
    _model = PurchaseOrderLine
    _serializer = PurchaseOrderLineSerializer


class PurchaseOrderLineDetail(APIViewDetail):
    _model = PurchaseOrderLine
    _serializer = PurchaseOrderLineSerializer
