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

    def _add_default_values(self, data):
        return data

    def _format_values(self, data):
        return data

    def get(self, args=[], count=False, order="id ASC", limit=80, offset=0, fields=[]):
        reqm = RequestManager()

        with reqm as _:
            data = {
                'where_params': args,
                'count': count,
                'order': order,
                'limit': limit,
                'offset': offset,
                'fields': fields
            }
            response = requests.get(f'{self._URL}{self._name}',
                json=data)
            response.raise_for_status()

            return {
                'ok': True,
                'data': response.json()
                }

        return reqm.error

    def browse(self, ids):
        if not isinstance(ids, list) and not isinstance(ids, int):
            return {
                'ok': False,
                'error': 'bad ids'
            }

        if isinstance(ids, list):
            return self.get([['id', 'in', ids]])


        reqm = RequestManager()

        with reqm as _:
            response = None

            response = requests.get(f'{self._URL}{self._name}/{ids}')
            response.raise_for_status()

            return {
                'ok': True,
                'data': response.json()
                }

        return reqm.error

    def create(self, data):
        if not isinstance(data, dict):
            return {
                'ok': False,
                'error': 'Bad Data'
            }

        data = self._add_default_values(data)
        data = self._format_values(data)

        reqm = RequestManager()

        with reqm as _:
            response = None

            response = requests.post(f'{self._URL}{self._name}', data=data)
            response.raise_for_status()

            return {
                'ok': True,
                'data': response.json()
                }

        return reqm.error

    def update(self, data):
        if not isinstance(data, dict):
            return {
                'ok': False,
                'error': 'Bad Data'
            }

        if not data.get('id'):
            return {
                'ok': False,
                'error': 'Missing ID'
            }

        data = self._format_values(data)

        reqm = RequestManager()

        with reqm as _:
            response = None

            response = requests.put(f'{self._URL}{self._name}/{data["id"]}',
                data=data)
            response.raise_for_status()

            return {
                'ok': True,
                'data': response.json()
                }

        return reqm.error
