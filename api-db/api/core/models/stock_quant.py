# -*- coding: utf-8 -*-

from .base import BaseModel

class StockQuant(BaseModel):

    _table = 'stock_quant'
    _fields = {
            'id': 0, # Integer
            'available_quantity': 0, # Numeric
            'in_date': '', #Date
            'product_id': 0, #Integer
            'quantity': 0, # Numeric
        }
    _relational_fields = {
            'product_id': 'produdct_product'
        }