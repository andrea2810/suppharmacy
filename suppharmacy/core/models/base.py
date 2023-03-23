# -*- coding: utf-8 -*-

from contextlib import ContextDecorator
import requests
from requests.exceptions import ConnectionError, HTTPError

from django.conf import settings

# from .res_user import ResUser

class RequestManager:

    def __init__(self):
        self.error = {}

    def __enter__(self):
        return True

    def __exit__(self, exc_type, exc_value, exc_traceback):
        if exc_type == HTTPError:
            status_code = exc_value.response.status_code

            if status_code == 400:
                self.error = {
                    'ok': False,
                    'error': exc_value.response.json()['error']
                }

            elif status_code == 404:
                self.error = {
                    'ok': False,
                    'error': 'No data found'
                }
            
            else:
                self.error = {
                    'ok': False,
                    'error': 'Fatal Error API'
                }

        if exc_type == ConnectionError:
            self.error = {
                    'ok': False,
                    'error': "No Connection to API"
                }
        
        if self.error:
            return True

        return False


class BaseModel:
    _name = ''
    _URL = settings.API_DB_URL
    __classes = {}

    def _add_class(self, txt, cls):
        self.__classes[txt] = cls()

    def __getitem__(self, key):
        return self.__classes[key]

    def __contains__(self, key):
        return key in self.__classes

    def get(self, args=[], count=False, order="id ASC", limit=80, offset=0):
        reqm = RequestManager()

        with reqm as _:
            data = {
                'where_params': args,
                'count': count,
                'order': order,
                'limit': limit,
                'offset': offset
            }
            response = requests.get(f'{self._URL}{self._name}',
                json=data)
            response.raise_for_status()

            return {
                'ok': True,
                'data': response.json()
                }

        return reqm.error
