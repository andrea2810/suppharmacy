# -*- coding: utf-8 -*-

from passlib.context import CryptContext

from core.models import BaseModel, model


class ResUser(BaseModel):
    _name = 'user'

    def login(self, data):
        user = self.get([
            ['username', '=', data.get('user', '')],
        ])

        if user.get('ok') and user.get('data'):
            user = user['data'][0]
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
