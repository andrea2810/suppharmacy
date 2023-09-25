# -*- coding: utf-8 -*-

from .base import BaseModel

class SaleOrder(BaseModel):

    _table = 'sale_order'
    _fields = {
            'id': 0, # Integer
            'active': True, #Boolean
            'amount_total': 0.0, #Numeric
            'amount_untaxed': 0.0, #Numeric
            'date': '', #Date
            'name': '', # Varchar
            'partner_id': None, #Integer
            'state': '', #Varchar
            'user_id': None, #Integer
        }
    _relational_fields = {
            'partner_id': 'res_partner',
            'user_id': 'res_users'
        }
