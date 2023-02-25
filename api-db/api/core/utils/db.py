# -*- coding: utf-8 -*-

from contextlib import contextmanager
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

    @contextmanager
    def get_cursor(self, pool_name):
        pool = getattr(self, pool_name)
        conn = pool.getconn()
        cur = conn.cursor(cursor_factory=DictCursor)

        try:
            yield cur
            conn.commit()
        except:
            conn.rollback()
        finally:
            cur.close()
            pool.putconn(conn)

    def read_from_instance(self, instance):
        res = []

        with self.get_cursor('_read_pool') as cur:
            cur.execute(instance.read_query())
            res = [instance.__class__(**rec) for rec in cur.fetchall()]

        return res

    def create_from_instance(self, instance):
        with self.get_cursor('_write_pool') as cur:
            query, params = instance.create_query()

            cur.execute(query, params)
            instance.id = cur.fetchone()['id']

        return True
