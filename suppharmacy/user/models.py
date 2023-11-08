# -*- coding: utf-8 -*-

from passlib.context import CryptContext

from core.models import BaseModel, model


class ResUser(BaseModel):
    _name = 'user'

    def _format_values(self, data):
        if 'password' in data:
            data['password'] = self.__get_crypt_context().hash(data['password'])

        return data

    def login(self, data):
        user = self.get([
            ['username', '=', data.get('user', '')],
        ], fields=['name', 'password'])

        if user:
            user = user[0]
            if self.__get_crypt_context().verify(data.get('password', ''),
                user.get('password', '')):
                return user

        return {}

    @classmethod
    def __get_crypt_context(cls):
        return CryptContext(
            ['pbkdf2_sha512', 'plaintext'],
            deprecated=['auto'],
            pbkdf2_sha512__rounds=350000,
        )

model._add_class('user', ResUser)
