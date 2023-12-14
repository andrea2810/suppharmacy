# -*- coding: utf-8 -*-

from uuid import uuid4

from core.models import BaseModel, model


class Sale(BaseModel):
    _name = 'sale-order'

    state = {
        'draft': 'Borrador',
        'sale': 'Validado',
        'cancel': 'Cancelado',
    }

    def onchange_lines(self, lines):
        amount_untaxed = 0
        amount_total = 0

        for line in lines:
            amount_untaxed += line.get('price_subtotal', 0)
            amount_total += line.get('price_total', 0)

        return {
            'amount_untaxed': round(amount_untaxed, 2),
            'amount_total': round(amount_total, 2),
        }

    def _get_next_name(self):
        last_rec = self.get(args=[], order="id DESC", limit=1, fields=['name'])

        if last_rec:
            last_rec = last_rec[0]

            seq, num = last_rec['name'].split('-')

            return f"{seq}-{str(int(num) + 1).zfill(6)}"

        return 'V-000001'

    def _add_default_values(self, data):
        res = super()._add_default_values(data)

        if data.get('name', 'Nuevo') == 'Nuevo':
            data.update({
                'name': self._get_next_name()
            })

        return data

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
        lineModel = model['sale-order-line']

        for operation, line_id, data in lines:
            if operation == 0: # Create
                del data['id']
                data['order_id'] = sale_id

                lineModel.create(data)

            if operation == 1: # Update
                lineModel.update(data)
                
            if operation == 2: # Delete
                lineModel.delete([line_id])

    def action_confirm_sale(self, sale_id):
        # TODO validaciones y mover inventario

        self.update({
            'id': sale_id, 
            'state': 'sale',
        })

        return True

class SaleLine(BaseModel):
    _name = 'sale-order-line'

    def onchange_line(self, line):
        if not isinstance(line, dict):
            raise Exception("Bad format line")
            
        if not 'product_id' in line:
            raise Exception("product_id must exist")

        product =  model['product'].browse(line['product_id'])

        if not product:
            raise Exception("Medicamento no encontrado")

        available_qty = model['stock-quant'].available_qty(product['id'])

        if available_qty < line.get('product_qty', 0):
            raise Exception(f"No hay suficiente medicamento\n"
                f"Sólo hay {int(available_qty)} piezas disponibles")

        price_subtotal = line.get('product_qty', 0) * product['list_price']
        price_total = price_subtotal

        return {
            'id': str(uuid4()) if not line.get('id', 0) else line['id'],
            'product_id': product['id'],
            'product_name': product['name'],
            'product_qty': line.get('product_qty', 0),
            'price_unit': round(product['list_price'], 2),
            'taxes': round(0, 2),
            'price_subtotal': round(price_subtotal, 2),
            'price_total': round(price_total, 2)
        }

model._add_class('sale-order', Sale)
model._add_class('sale-order-line', SaleLine)
