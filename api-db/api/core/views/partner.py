# -*- coding: utf-8 -*-

from .base import APIViewList, APIViewDetail

from api.core.models import Partner
from api.core.serializers import PartnerSerializer


class PartnerList(APIViewList):
    _model = Partner
    _serializer = PartnerSerializer


class PartnerDetail(APIViewDetail):
    _model = Partner
    _serializer = PartnerSerializer
