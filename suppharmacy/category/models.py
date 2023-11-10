# -*- coding: utf-8 -*-

from core.models import BaseModel, model


class DrugCategory(BaseModel):
    _name = 'drug-category'

model._add_class('drug-category', DrugCategory)
