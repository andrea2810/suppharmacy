# -*- coding: utf-8 -*-

from core.models import BaseModel, model


class Product(BaseModel):
    _name = 'product'

model._add_class('product', Product)
