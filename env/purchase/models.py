from django.conf import settings
from django.utils.translation import gettext as _
from django.db import models

# Create your models here.
class PurchaseOrder(models.Model):

    STATUS = (
       ('draft', _('Draft')),
       ('confirmed', _('Confirmed')),
       ('done', _('Done')),
       ('cancel', _('Cancel'))
    )

    active = models.BooleanField()
    amount_total = models.FloatField()
    amount_untaxed = models.FloatField()
    date = models.DateField()
    name = models.CharField(
        max_length=100,
        unique=True)
    partner_id = models.ForeignKey(
        'base.ResPartner',
        on_delete=models.CASCADE)
    state = models.CharField(
        max_length=20,
        choices=STATUS,
        default='draft',)
    user_id = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

class PurchaseOrderLine(models.Model):

    name = models.CharField(max_length=100)
    order_id = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.CASCADE)
    price_subtotal = models.FloatField()
    price_total = models.FloatField()
    price_unit = models.FloatField()
    product_id = models.ForeignKey(
        'stock.ProductProduct',
        on_delete=models.CASCADE)
    product_qty = models.FloatField()
    taxes = models.FloatField()