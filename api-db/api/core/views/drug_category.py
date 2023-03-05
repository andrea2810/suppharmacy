# -*- coding: utf-8 -*-

from .base import APIViewList, APIViewDetail

from api.core.models import DrugCategory
from api.core.serializers import DrugCategorySerializer


class DrugCategoryList(APIViewList):
    _model = DrugCategory
    _serializer = DrugCategorySerializer


class DrugCategoryDetail(APIViewDetail):
    _model = DrugCategory
    _serializer = DrugCategorySerializer
