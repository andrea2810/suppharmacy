# -*- coding: utf-8 -*-

import psycopg2

from api.core.utils import DB

BOOLEAN_OPERATORS = ('AND', 'OR')
LOGICAL_OPERATORS = (
    '=',
    '!=',
    'like',
    'ilike',
    '>',
    '>=',
    '<',
    '<=',
    'in'
)


class BaseModel:

    _table = ''
    _fields = {}
    _relational_fields = {}

    def __init__(self, **fields):
        for field, default_value in self._fields.items():
            setattr(self, field, fields.get(field, default_value))

    def _get_values(self, fields):
        if 'id' in fields:  
            del fields['id']

        return {field: getattr(self, field) for field in fields}

    def _get_read_fields(self, fields=set()):
        res = None
        model_fields = set(self._fields)

        if fields:
            if not self._relational_fields:
                res = model_fields & fields

            else:
                # TODO Validate fields from JOIN
                res = fields

        else:
            res = model_fields

        if self._relational_fields:
            res = list(res)

            for i in range(len(res)):
                field = res[i]

                if not '.' in field:
                    res[i] = f'{self._table}.{field}'
                else:
                    relational_field, join_field = field.split('.')

                    res[i] = f'{self._relational_fields[relational_field]}.{join_field} AS {relational_field[:-2]}{join_field}'

        return res
    
    def _get_joins(self):
        if not self._relational_fields:
            return ''
        
        res = ''

        for field, table in self._relational_fields.items():
            res += f'LEFT JOIN {table} ON {table}.id = {self._table}.{field} '

        return res

    def _format_where_params(self, args):
        res = ''
        params = []
        condition_added = False

        if not isinstance(args, list):
            raise PGError(f"The where_params must be a list")

        for arg in args:
            if condition_added and not isinstance(arg, str):
                res += 'AND '

            if isinstance(arg, str):
                condition_added = False
                if arg not in BOOLEAN_OPERATORS:
                    raise PGError(f"The argument '{arg}' is not a valid operator")

                res += f'{arg} '

            elif isinstance(arg, list):
                field = None
                operator = None
                value = None

                try:
                    field, operator, value = arg
                except:
                    raise PGError("The list of parameters must have 3 elements")

                if self._relational_fields:
                    # TODO Validate fields from JOIN
                    pass
                elif not field in self._fields:
                    raise PGError(f"The field {field} is not declared in "\
                        f"the table {self._table}")

                if not operator in LOGICAL_OPERATORS:
                    raise PGError(f"The operator {operator} is not valid")

                if self._relational_fields:
                    if not '.' in field:
                        field = f'{self._table}.{field}'
                    else:
                        try: 
                            relational_field, join_field = field.split('.')

                            field = f'{self._relational_fields[relational_field]}.{join_field}'
                        except:
                            raise PGError(f"The relational field {field} has to be separated by 1 dot")

                res += f'{field} {operator} %s '
                if operator == 'in':
                    params.append(tuple(value))
                else:
                    params.append(value)

                condition_added = True

            else:
                raise PGError(f"The argument '{arg}' is unknown")

        if res:
            res = f'WHERE {res}'

        return res, tuple(params)

    def get(self, args={}):
        db = DB()
        return db.read_from_instance(self, args)

    def create(self, fields):
        db = DB()
        return db.create_from_instance(self, fields)

    def update(self, data):
        db = DB()
        return db.update_from_instance(self, data)

    def delete(self):
        db = DB()
        return db.delete_from_instance(self)
