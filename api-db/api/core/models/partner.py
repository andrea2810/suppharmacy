# -*- coding: utf-8 -*-

from .base import BaseModel

class Partner(BaseModel):

    _table = 'partner'
    _fields = {
            'id': 0, # Integer
            'name': '', # Varchar
            'last_name': '' # Varchar 
        }
