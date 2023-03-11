# -*- coding: utf-8 -*-

from core.models import BaseModel, model

class ResUser(BaseModel):
    _name = 'user'

model._add_class('user', ResUser)
