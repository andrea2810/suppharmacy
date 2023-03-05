# -*- coding: utf-8 -*-

from .base import BaseModel

class PurchaseOrder(BaseModel):

    _table = 'purchase_order'
    _fields = {
            'id': 0, # Integer
            'active': True, #Boolean
            'amount_total': 0.0, #Numeric
            'amount_untaxed': 0.0, #Numeric
            'date': '', #Date
            'name': '', # Varchar
            'partner_id': 0, #Integer
            'state': '', #Varchar
            'user_id': 0, #Integer
        }