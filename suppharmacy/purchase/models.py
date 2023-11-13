# -*- coding: utf-8 -*-

from uuid import uuid4

from core.models import BaseModel, model


class Purchase(BaseModel):
    _name = 'purchase-order'

    def onchange_lines(self, lines):
        amount_untaxed = 0
        amount_total = 0

        for line in lines:
            amount_untaxed += line.get('price_subtotal', 0)
            amount_total += line.get('price_total', 0)

        return {
            'amount_untaxed': amount_untaxed,
            'amount_total': amount_total,
        }

    def create(self, data):
        res = super().create(data)

        if data.get('line_ids'):
            self._process_lines(res['id'], data['line_ids'])

        return res

    def update(self, data):
        res = super().update(data)

        if data.get('line_ids'):
            self._process_lines(res['id'], data['line_ids'])

        return res

    def _process_lines(self, sale_id, lines):
        lineModel = model['purchase-order-line']

        for operation, line_id, data in lines:
            if operation == 0: # Create
                del data['id']
                data['order_id'] = sale_id

                lineModel.create(data)

            if operation == 1: # Update
                lineModel.update(data)
                
            if operation == 2: # Delete
                lineModel.delete([line_id])

class PurchaseLine(BaseModel):
    _name = 'purchase-order-line'

    def onchange_line(self, line):
        if not isinstance(line, dict):
            raise Exception("Bad format line")
            
        if not 'product_id' in line:
            raise Exception("product_id must exist")

        product =  model['product'].browse(line['product_id'])

        if not product:
            raise Exception("Medicamento no encontrado")

        price_subtotal = line.get('product_qty', 0) * product['dealer_price']
        price_total = price_subtotal

        return {
            'id': str(uuid4()) if not line.get('id', 0) else line['id'],
            'product_id': product['id'],
            'product_name': product['name'],
            'product_qty': line.get('product_qty', 0),
            'price_unit': product['dealer_price'],
            'taxes': 0,
            'price_subtotal': price_subtotal,
            'price_total': price_total
        }

model._add_class('purchase-order', Purchase)
model._add_class('purchase-order-line', PurchaseLine)
