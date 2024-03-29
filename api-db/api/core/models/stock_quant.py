# -*- coding: utf-8 -*-

from .base import BaseModel

class StockQuant(BaseModel):

    _table = 'stock_quant'
    _fields = {
            'id': 0, # Integer
            'available_quantity': 0, # Numeric
            'expiration_time': '', #Date
            'lot_number': '', #Varchar
            'product_id': None, #Integer
            'quantity': 0, # Numeric
        }
    _relational_fields = {
            'product_id': 'product_product'
        }