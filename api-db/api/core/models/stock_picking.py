# -*- coding: utf-8 -*-

from .base import BaseModel

class StockPicking(BaseModel):

    _table = 'stock_picking'
    _fields = {
            'id': 0, # Integer
            'name': '', # Varchar
            'date': '', #Date
            'partner_id': None, #Integer
            'sale_id': None, #Integer
            'purchase_id': None, #Integer
            'state': '', # Varchar
            'type_picking': '', # Varchar
            'user_id': None, #Integer
        }

    _relational_fields = {
            'partner_id': 'res_partner',
            'sale_id': 'sale_order',
            'purchase_id': 'purchase_order',
            'user_id': 'res_users'
        }