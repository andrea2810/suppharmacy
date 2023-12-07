# -*- coding: utf-8 -*-

from uuid import uuid4

from core.models import BaseModel, model


class StockPicking(BaseModel):
    _name = 'stock-picking'

    state = {
        'draft': 'Borrador',
        'ready': 'Preparado',
        'done': 'Hecho',
        'cancel': 'Cancelado',
    }

    type_picking = {
        'sale': 'Salida',
        'purchase': 'Ingreso',
        'expired': 'Expirado',
    }

    # def onchange_lines(self, lines):
    #     amount_untaxed = 0
    #     amount_total = 0

    #     for line in lines:
    #         amount_untaxed += line.get('price_subtotal', 0)
    #         amount_total += line.get('price_total', 0)

    #     return {
    #         'amount_untaxed': amount_untaxed,
    #         'amount_total': amount_total,
    #     }

    def _get_next_name(self, type_picking):
        last_rec = self.get(args=[['type_picking', '=', type_picking]], order="id DESC",
            limit=1, fields=['name'])

        if last_rec:
            last_rec = last_rec[0]

            seq, num = last_rec['name'].split('-')

            return f"{seq}-{str(int(num) + 1).zfill(6)}"

        if type_picking == 'sale':
            return 'MV-000001'
        if type_picking == 'purchase':
            return 'MC-000001'
        if type_picking == 'expired':
            return 'ME-000001'

        return ""

    def _add_default_values(self, data):
        res = super()._add_default_values(data)

        if data.get('name', 'Nuevo') == 'Nuevo':
            if not 'type_picking' in data:
                raise Exception("El campo de tipo de movimiento es requerido")

            type_picking = data['type_picking']

            data.update({
                'name': self._get_next_name(type_picking)
            })

        return data

    def create(self, data):
        res = super().create(data)

        if data.get('move_ids'):
            self._process_moves(res['id'], data['move_ids'])

        return res

    def update(self, data):
        res = super().update(data)

        if data.get('move_ids'):
            self._process_moves(res['id'], data['move_ids'])

        return res

    def _process_moves(self, picking_id, moves):
        moveModel = model['stock-move']

        for operation, move_id, data in moves:
            if operation == 0: # Create
                del data['id']
                data['picking_id'] = picking_id

                moveModel.create(data)

            if operation == 1: # Update
                moveModel.update(data)
                
            if operation == 2: # Delete
                moveModel.delete([move_id])

class StockMove(BaseModel):
    _name = 'stock-move'

    def onchange_move(self, move):
        if not isinstance(move, dict):
            raise Exception("Bad format move")
            
        if not 'product_id' in move:
            raise Exception("product_id must exist")

        product =  model['product'].browse(move['product_id'])

        if not product:
            raise Exception("Medicamento no encontrado")

        return {
            'id': str(uuid4()) if not move.get('id', 0) else move['id'],
            'product_id': product['id'],
            'name': product['name'],
            'product_name': product['name'],
            'lot_number': move.get('lot_number', ''),
            'product_qty': move.get('product_qty', 0),
        }


class StockQuant(BaseModel):
    _name = 'stock-quant'

model._add_class('stock-picking', StockPicking)
model._add_class('stock-move', StockMove)
model._add_class('stock-quant', StockQuant)
