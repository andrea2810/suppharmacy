# -*- coding: utf-8 -*-

import psycopg2

class Partner:
    def __init__(self, **fields):
        self.id = fields.get('id', 0)
        self.name = fields.get('name', '')

    @staticmethod
    def get():
        res = []

        with psycopg2.connect(dbname='demo', user='postgres', password='admin', host="192.168.32.1") as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
                cur.execute("SELECT * FROM partner")
                res = [Partner(**rec) for rec in cur.fetchall()]

        return res

    def create(self):
        with psycopg2.connect(dbname='demo', user='postgres', password='admin', host="192.168.32.1") as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
                cur.execute("INSERT INTO partner (name) VALUES(%(name)s) RETURNING id", {
                        'name': self.name,
                    })
                self.id = cur.fetchone()['id']
            conn.commit()
        
        return True
