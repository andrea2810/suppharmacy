# -*- coding: utf-8 -*-

from .base import APIViewList, APIViewDetail

from api.core.models import ResUsers
from api.core.serializers import ResUsersSerializer


class ResUsersList(APIViewList):
    _model = ResUsers
    _serializer = ResUsersSerializer


class ResUsersDetail(APIViewDetail):
    _model = ResUsers
    _serializer = ResUsersSerializer
