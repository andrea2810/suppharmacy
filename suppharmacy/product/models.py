# -*- coding: utf-8 -*-

from core.models import BaseModel, model


class Product(BaseModel):
    _name = 'product'

    def _get_related_quant(self, product_id):
        quant = model['stock-quant'].get([['product_id', '=', product_id]],
            fields=['quantity'], limit=1)
        
        return {
            'quant_id': quant and quant[0]['id'] or 0,
            'quantity': quant and quant[0]['quantity'] or 0,
        }
    
    def get(self, args=[], count=False, order="id ASC", limit=80, offset=0, fields=[]):
        quant = False

        if 'quant' in fields:
            quant = True
            fields.remove('quant')

        res = super().get(args, count, order, limit, offset, fields)

        if not count and quant:
            for product in res:
                quant_vals = self._get_related_quant(product['id'])

                product.update(quant_vals)

        return res

model._add_class('product', Product)
