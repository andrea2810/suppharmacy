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
            'quantity_done': 0, # Numeric
            'product_id': None, # Integer
            'product_qty': 0, # Numeric
        }
    _relational_fields = {
            'picking_id': 'stock_picking',
            'product_id': 'product_product'
        }