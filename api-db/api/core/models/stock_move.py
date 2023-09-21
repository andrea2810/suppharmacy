# -*- coding: utf-8 -*-

from .base import BaseModel

class StockMove(BaseModel):

    _table = 'stock_move'
    _fields = {
            'id': 0, # Integer
            'date': '', #Date
            'name': '', # Varchar
            'origin': '', # Varchar
            'purchase_id': 0, #Integer
            'sale_id': 0, #Integer
            'picking_id': 0, #Integer
            'quantity_done': 0, # Numeric
            'product_qty': 0, # Numeric
            'state': '', # Varchar
        }
    _relational_fields = {
            'purchase_id': 'purchase_order',
            'sale_id': 'sale_order',
            'picking_id': 'stock_picking'
        }