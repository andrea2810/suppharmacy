# -*- coding: utf-8 -*-
# import psycopg2

import logging
from psycopg2 import pool
from psycopg2.extras import DictCursor

from django.conf import settings

_logger = logging.getLogger('core')

def _connect(config_params):
    return pool.ThreadedConnectionPool(config_params['minconn'],
        config_params['maxconn'], **config_params['params'])


class DB:
    _read_pool = None
    _write_pool = None

    def __init__(self):
        if self._read_pool is None:
            DB._read_pool = _connect(settings.POSTGRES['hot-stanby'])

        if self._write_pool is None:
            DB._write_pool = _connect(settings.POSTGRES['master'])

    def read(self, instance):
        res = []

        with self._read_pool.getconn() as conn:
            with conn.cursor(cursor_factory=DictCursor) as cur:
                cur.execute(instance.read_query())
                res = [instance.__class__(**rec) for rec in cur.fetchall()]

        return res
