# -*- coding: utf-8 -*-

from .base import BaseModel

class ProductProduct(BaseModel):

    _table = 'product_product'
    _fields = {
            'id': 0, # Integer
            'active': True, #Boolean
            'code': '', # Varchar
            'dealer_price': 0.0, # Numeric
            'description': '', # Varchar
            'expiration_time': '', #Date
            'list_price': 0.0, # Numeric
            'name': '', # Varchar
            'qty_available': 0.0, # Numeric
            'sale_ok': True, #Boolean
            'taxes': 0.0, # Numeric
            'presentation': '', #Varchar
            'laboratory_id': 0, #Integer
            'drug_category_id': 0, #Integer
            'is_antibiotic': False #Boolean
        }