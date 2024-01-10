# -*- coding: utf-8 -*-

from .base import BaseModel

class PurchaseOrderLine(BaseModel):

    _table = 'purchase_order_line'
    _fields = {
            'id': 0, # Integer
            'order_id': None, # Integer
            'price_unit': 0.0, # Numeric
            'price_total': 0.0, # Numeric
            'product_id': None, # Integer
            'product_qty': 0.0, # Numeric
        }
    _relational_fields = {
            'order_id': 'purchase_order',
            'product_id': 'product_product'
        }