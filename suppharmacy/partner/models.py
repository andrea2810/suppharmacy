# -*- coding: utf-8 -*-

from core.models import BaseModel, model


class Partner(BaseModel):
    _name = 'partner'

model._add_class('partner', Partner)
