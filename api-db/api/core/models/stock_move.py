# -*- coding: utf-8 -*-

from .base import BaseModel

class StockMove(BaseModel):

    _table = 'stock_move'
    _fields = {
            'id': 0, # Integer
            'date': '', #Date
            'name': '', # Varchar
            'origin': '', # Varchar
            'picking_id': None, #Integer
            'product_id': None, # Integer
            'product_qty': 0, # Numeric
            'lot_number': '', # Varchar
            'expiration_time': '', # Date
        }
    _relational_fields = {
            'picking_id': 'stock_picking',
            'product_id': 'product_product'
        }