# -*- coding: utf-8 -*-

from .base import APIViewList, APIViewDetail

from api.core.models import ResPartner
from api.core.serializers import ResPartnerSerializer


class ResPartnerList(APIViewList):
    _model = ResPartner
    _serializer = ResPartnerSerializer


class ResPartnerDetail(APIViewDetail):
    _model = ResPartner
    _serializer = ResPartnerSerializer
