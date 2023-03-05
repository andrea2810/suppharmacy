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
            'type_picking': 0.0, # Numeric
            'user_id': 0, #Integer
        }