# -*- coding: utf-8 -*-

from .base import BaseModel

class Partner(BaseModel):

    _table = 'res_partner'
    _fields = {
            'id': 0, # Integer
            'active': True, #Boolean
            'name': '', # Varchar
            'birth_date': '', #Date
            'city': '', #Varchar
            'country': '', #Varchar
            'email': '', #Varchar
            'is_company': False, #Boolean
            'mobile': '', #Varchar
            'phone': '', #Varchar
            'ref': '', #Varchar
            'rfc': '', #Varchar
            'cp': '' #Varchar
        }