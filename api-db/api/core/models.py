# -*- coding: utf-8 -*-

import psycopg2
from .utils.db import DB

class BaseModel:

    _table = ''
    _fields = {}

    def __init__(self, **fields):
        for field, default_value in self._fields.items():
            setattr(self, field, fields.get(field, default_value))

    def read_query(self):
        return f' \
                SELECT \
                    {", ".join(field for field in self._fields)} \
                FROM {self._table}\
            '

    def create(self):
        pass

class Partner(BaseModel):

    _table = 'partner'
    _fields = {
            'id': 0, # Integer
            'name': '', # Varchar
            # 'name1': '', # Varchar
        }

    @staticmethod
    def get():
        db = DB()
        return db.read(Partner())

    def create(self):
        with psycopg2.connect(dbname='demo', user='postgres', password='admin', host="192.168.32.1") as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
                cur.execute("INSERT INTO partner (name) VALUES(%(name)s) RETURNING id", {
                        'name': self.name,
                    })
                self.id = cur.fetchone()['id']
            conn.commit()
        
        return True
