# -*- coding: utf-8 -*-

class Partner:
    def __init__(self, name):
        self.name = name

    @staticmethod
    def get():
        return [Partner(name="Saulson"), Partner(name="Rouz")]