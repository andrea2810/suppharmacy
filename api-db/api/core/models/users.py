# -*- coding: utf-8 -*-

from .base import BaseModel

class ResUsers(BaseModel):

    _table = 'res_users'
    _fields = {
            'id': 0, # Integer
            'active': True, #Boolean
            'name': '', # Varchar
            'username': '', #Varchar
            'password': '' #Varchar
        }

    def _get_read_fields(self):
        return ['id', 'active', 'name', 'username']
