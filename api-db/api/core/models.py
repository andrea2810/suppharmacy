# -*- coding: utf-8 -*-

import copy
import psycopg2
from .utils.db import DB

class BaseModel:

    _table = ''
    _fields = {}

    def __init__(self, **fields):
        for field, default_value in self._fields.items():
            setattr(self, field, fields.get(field, default_value))

    def _get_values(self):
        fields = copy.deepcopy(self._fields)        
        del fields['id']

        return {field: getattr(self, field) for field in fields.keys()}

    def get(self, args={}):
        db = DB()
        return db.read_from_instance(self, args)

    def create(self):
        db = DB()
        return db.create_from_instance(self)

    def update(self, data):
        db = DB()
        return db.update_from_instance(self, data)

class Partner(BaseModel):

    _table = 'partner'
    _fields = {
            'id': 0, # Integer
            'name': '', # Varchar
            'last_name': '' # Varchar 
        }
