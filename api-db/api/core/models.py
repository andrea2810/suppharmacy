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

    def create_query(self):
        vals = self._get_values()
        fields = vals.keys()

        return f'\
                INSERT INTO \
                    {self._table} ({", ".join(field for field in fields)}) \
                VALUES ({", ".join("%({})s".format(field) for field in fields)}) \
                RETURNING id \
            ', vals

class Partner(BaseModel):

    _table = 'partner'
    _fields = {
            'id': 0, # Integer
            'name': '', # Varchar
        }
