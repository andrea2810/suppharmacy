# -*- coding: utf-8 -*-

from collections import defaultdict
from datetime import date
from uuid import uuid4

from core.models import BaseModel, model


class Sale(BaseModel):
    _name = 'sale-order'

    state = {
        'draft': 'Borrador',
        'sale': 'Validado',
        'cancel': 'Cancelado',
    }

    def _get_related_picking(self, sale_id):
        picking = model['stock-picking'].get([['sale_id', '=', sale_id]],
            fields=['name'], limit=1)

        return {
            'picking_id': picking and picking[0]['id'] or 0,
            'picking_name': picking and picking[0]['name'] or '',
        }

    def onchange_lines(self, lines):
        amount_total = 0
        requires_prescription = False

        for line in lines:
            amount_total += line.get('price_total', 0)

            product_id = line.get('product_id', 0)

            if product_id and not requires_prescription:
                product = model['product'].browse(product_id, fields=['is_antibiotic'])

                if product.get('is_antibiotic'):
                    requires_prescription = True

        return {
            'amount_total': round(amount_total, 2),
            'requires_prescription': requires_prescription
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

    def get(self, args=[], count=False, order="id ASC", limit=0, offset=0, fields=[]):
        picking = False

        if 'picking' in fields:
            picking = True
            fields.remove('picking')

        res = super().get(args, count, order, limit, offset, fields)

        if not count and picking:
            for sale in res:
                picking_vals = self._get_related_picking(sale['id']) 

                sale.update(picking_vals)

        return res

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
                data.pop('id', None)
                data['order_id'] = sale_id

                lineModel.create(data)

            if operation == 1: # Update
                lineModel.update(data)
                
            if operation == 2: # Delete
                lineModel.delete([line_id])

    def _check_confirm(self, sale, lines):
        if sale['state'] != 'draft':
            raise Exception("El registro solo se puede confirmar si está en Borrador")

        if not sale['partner_id']:
            raise Exception("Debe seleccionar el cliente")

        if not sale['user_id']:
            raise Exception("Debe seleccionar el usuario")

        if not sale['date']:
            raise Exception("Debe seleccionar una fecha")

        if sale['requires_prescription'] and not sale['prescription']:
            raise Exception("Alguno de los medicamentos es antibiótico, por lo que debe solicitar la receta")

        distinct_products = len(set((line['product_id'] for line in lines)))

        if distinct_products != len(lines):
            raise Exception("Hay medicamentos duplicados, solo debe existir un "
                "medicamento por linea")

        for line in lines:
            if not line['product_id']:
                raise Exception("Todas las lineas deben tener medicamentos")

            if line['product_qty'] <= 0:
                raise Exception("Debe registrar al menos 1 en la cantidad del "
                    f"medicamento {line['product_name']}")

    def action_confirm_sale(self, sale_id):
        picking_model = model['stock-picking']
        sale_line_model = model['sale-order-line']

        sale = self.browse(sale_id, fields=[
            'partner_id', 'user_id', 'date', 'state', 'requires_prescription',
            'prescription'
        ])
        lines = sale_line_model.get([('order_id', '=', sale_id)],
            fields=['product_id', 'product_id.name', 'product_qty'])

        self._check_confirm(sale, lines)
        moves = sale_line_model._get_lines_stock_move(lines)

        picking = picking_model.create({
            'partner_id': sale['partner_id'],
            'user_id': sale['user_id'],
            'date': date.today().isoformat(),
            'type_picking': 'sale',
            'sale_id': sale['id'],
            'state': 'draft',
            'move_ids': [(0, 0, move) for move in moves]
        })

        picking_model.action_confirm(picking['id'])
        picking_model.action_validate(picking['id'])

        self.update({
            'id': sale_id, 
            'state': 'sale',
        })

        return self._get_message_confirm(moves)

    def _get_message_confirm(self, moves):
        grouped_moves = defaultdict(list)

        for move in moves:
            grouped_moves[move['name']].append((move['lot_number'], move['product_qty']))

        msg = '''
            <h5>
                Favor de tomar los siguientes lotes de los medicamentos
            </h5>
        '''

        for product_name, lots in grouped_moves.items():
            msg += f'''
                <div class="row">
                    <div class="col-12">
                        {product_name}
                    </div>
                </div>
            '''

            msg += '''
                <div class="row">
                    <div class="col-6">
                        Lote
                    </div>
                    <div class="col-6">
                        Cantidad
                    </div>
                </div>
            '''

            for lot, qty in lots:
                msg += f'''
                    <div class="row">
                        <div class="col-6">
                            {lot}
                        </div>
                        <div class="col-6">
                            {int(qty)}
                        </div>
                    </div>
                '''

            msg += '<br/>'

        return {
            'title': 'Atención',
            'msg': msg,
        }

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

        product_qty = line.get('product_qty', 0)

        if product_qty <= 0:
            raise Exception("Debe registrar al menos 1 en la cantidad")

        available_qty = model['stock-quant'].available_qty(product['id'])

        if available_qty < product_qty:
            raise Exception(f"No hay suficiente medicamento\n"
                f"Sólo hay {int(available_qty)} piezas disponibles")

        price_total = product_qty * product['list_price']

        return {
            'id': str(uuid4()) if not line.get('id', 0) else line['id'],
            'product_id': product['id'],
            'product_name': product['name'],
            'product_qty': product_qty,
            'price_unit': round(product['list_price'], 2),
            'price_total': round(price_total, 2)
        }

    def _get_lines_stock_move(self, lines):
        res = []
        quant = model['stock-quant']

        for line in lines:
            quants = quant.supply_product(line['product_id'], line['product_qty'])

            for quant_id, lot_number, quantity in quants:
                res.append({
                    'name': line['product_name'],
                    'product_id': line['product_id'],
                    'product_qty': quantity,
                    'lot_number': lot_number,
                })

        return res

model._add_class('sale-order', Sale)
model._add_class('sale-order-line', SaleLine)
