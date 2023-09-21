# -*- coding: utf-8 -*-

from contextlib import contextmanager
import logging
from psycopg2 import pool, Error as PGError
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
        except PGError as e:
            _logger.debug(cur.query)
            conn.rollback()
            raise e
        finally:
            cur.close()
            pool.putconn(conn)

    def _read_query(self, instance, args):
        where_params = args.get('where_params', [])
        count = args.get('count', False)
        order = args.get('order', 'id ASC')
        limit = args.get('limit', 80)
        offset = args.get('offset', 0)
        fields = set(args.get('fields', []))

        if instance._relational_fields and order:
            if not '.' in order:
                order = f'{instance._table}.{order}'

        where, params = instance._format_where_params(where_params)

        if count:
            return f' \
                    SELECT \
                        COUNT(1) \
                    FROM {instance._table} \
                    {where} \
                ', params

        return f' \
                SELECT \
                    {", ".join(field for field in instance._get_read_fields(fields))} \
                FROM {instance._table} \
                {instance._get_joins()} \
                {where} \
                ORDER BY {order} \
                LIMIT {limit} \
                OFFSET {offset} \
            ', params

    def _create_query(self, instance):
        vals = instance._get_values()
        fields = vals.keys()

        return f'\
                INSERT INTO \
                    {instance._table} ({", ".join(field for field in fields)}) \
                VALUES ({", ".join("%({})s".format(field) for field in fields)}) \
                RETURNING id \
            ', vals

    def _update_query(self, instance, data):
        fields = data.keys()
        where, params = self._format_where_params(instance, [['id', '=', instance.id]])

        return f'\
                UPDATE \
                    {instance._table} \
                SET {", ".join("{0} = %({0})s".format(field) for field in fields)} \
                {where} \
            ', {**data, **params}

    def _delete_query(self, instance):
        where, params = self._format_where_params(instance, [['id', '=', instance.id]])

        return f'\
                DELETE FROM \
                    {instance._table} \
                {where} \
            ', params

    def read_from_instance(self, instance, args):
        res = {}

        with self.get_cursor('_read_pool') as cur:
            cur.execute(*self._read_query(instance, args))

            if not args.get('count'):
                res = [instance.__class__(**rec) for rec in cur.fetchall()]
            else:
                res = {'count': cur.fetchone()[0]}

        return res

    def create_from_instance(self, instance):
        with self.get_cursor('_write_pool') as cur:
            cur.execute(*self._create_query(instance))
            instance.id = cur.fetchone()['id']

        return True

    def update_from_instance(self, instance, data):
        with self.get_cursor('_write_pool') as cur:
            cur.execute(*self._update_query(instance, data))

        return True

    def delete_from_instance(self, instance):
        with self.get_cursor('_write_pool') as cur:
            cur.execute(*self._delete_query(instance))

        return True
