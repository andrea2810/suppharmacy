# -*- coding: utf-8 -*-

from .base import BaseModel

class SaleOrderLine(BaseModel):

    _table = 'sale_order_line'
    _fields = {
            'id': 0, # Integer
            'order_id': 0, # Integer
            'price_subtotal': 0.0, # Numeric
            'price_unit': 0.0, # Numeric
            'price_total': 0.0, # Numeric
            'product_id': 0, # Integer
            'product_qty': 0.0, # Numeric
            'taxes': 0.0, # Numeric
        }