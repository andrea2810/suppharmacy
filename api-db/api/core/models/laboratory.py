# -*- coding: utf-8 -*-

from .base import BaseModel

class ResLaboratory(BaseModel):

    _table = 'res_laboratory'
    _fields = {
            'id': 0, # Integer
            'active': True, #Boolean
            'name': '' # Varchar
        }