# -*- coding: utf-8 -*-

from .base import BaseModel

class StockPicking(BaseModel):

    _table = 'stock_picking'
    _fields = {
            'id': 0, # Integer
            'name': '', # Varchar
            'date': '', #Date
            'partner_id': 0, #Integer
            'sale_id': 0, #Integer
            'purchase_id': 0, #Integer
            'state': '', # Varchar
            'type_picking': '', # Varchar
            'user_id': 0, #Integer
        }

    _relational_fields = {
            'partner_id': 'res_partner',
            'sale_id': 'sale_order',
            'purchase_id': 'purchase_order',
            'user_id': 'res_users'
        }