# -*- coding: utf-8 -*-

from .base import BaseModel

class DrugCategory(BaseModel):

    _table = 'drug_category'
    _fields = {
            'id': 0, # Integer
            'active': True, #Boolean
            'name': '' # Varchar
        }