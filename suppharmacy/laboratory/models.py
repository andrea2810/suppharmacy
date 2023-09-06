# -*- coding: utf-8 -*-

from passlib.context import CryptContext

from core.models import BaseModel, model


class Laboratory(BaseModel):
    _name = 'laboratory'

model._add_class('laboratory', Laboratory)
