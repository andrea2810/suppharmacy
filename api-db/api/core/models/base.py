# -*- coding: utf-8 -*-

import copy
import psycopg2

from api.core.utils import DB

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

    def _get_read_fields(self):
        return self._fields()

    def get(self, args={}):
        db = DB()
        return db.read_from_instance(self, args)

    def create(self):
        db = DB()
        return db.create_from_instance(self)

    def update(self, data):
        db = DB()
        return db.update_from_instance(self, data)

    def delete(self):
        db = DB()
        return db.delete_from_instance(self)
