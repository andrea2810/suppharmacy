# -*- coding: utf-8 -*-

from .base import APIViewList, APIViewDetail

from api.core.models import ProductProduct
from api.core.serializers import ProductProductSerializer


class ProductProductList(APIViewList):
    _model = ProductProduct
    _serializer = ProductProductSerializer


class ProductProductDetail(APIViewDetail):
    _model = ProductProduct
    _serializer = ProductProductSerializer
