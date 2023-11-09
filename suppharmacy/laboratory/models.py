# -*- coding: utf-8 -*-

from core.models import BaseModel, model


class Laboratory(BaseModel):
    _name = 'laboratory'

model._add_class('laboratory', Laboratory)
