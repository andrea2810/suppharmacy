from django.conf import settings
from django.utils.translation import gettext as _
from django.db import models

# Create your models here.
class ResLaboratory(models.Model):

    name = models.CharField(
        max_length=100,
        unique=True)

class DrugCategory(models.Model):

    name = models.CharField(
        max_length=30,
        unique=True)
    description = models.CharField(max_length=150)

class StockPicking(models.Model):

    STATUS = (
        ('draft', _('Draft')),
        ('confirmed', _('Confirmed')),
        ('done', _('Done')),
        ('cancel', _('Cancel'))
    )

    TYPE = {
        ('incoming', _('Incoming')),
        ('outgoing', _('Outgoing')),
        ('internal', _('Internal')),
    }

    date = models.DateField()
    name = models.CharField(
        max_length=100,
        unique=True)
    partner_id = models.ForeignKey(
        'base.ResPartner',
        on_delete=models.CASCADE)
    sale_id = models.ForeignKey(
      'sale.SaleOrder',
      on_delete=models.CASCADE)
    state = models.CharField(
        max_length=20,
        choices=STATUS,
        default='draft',)
    type_picking = models.CharField(
        max_length=50,
        choices=TYPE,
        default='incoming')
    user_id = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

class ProductProduct(models.Model):

    active = models.BooleanField()
    code = models.CharField(max_length=15)
    dealer_price = models.FloatField()
    description = models.CharField(max_length=150)
    expiration_time = models.DateField()
    list_price = models.FloatField()
    name = models.CharField(max_length=100)
    qty_available = models.IntegerField()
    sale_ok = models.BooleanField()
    taxes = models.FloatField()
    presentation = models.CharField(max_length=100)
    laboratory_id = models.ForeignKey(
        ResLaboratory,
        on_delete=models.CASCADE)
    drug_category_id = models.ForeignKey(
        DrugCategory,
        on_delete=models.CASCADE)
    is_antibiotic= models.BooleanField()

class StockQuant(models.Model):

    available_quantity = models.FloatField()
    in_date = models.DateField()
    product_id = models.ForeignKey(
        ProductProduct,
        on_delete=models.CASCADE)
    quantity = models.FloatField()

class StockMove(models.Model):

    STATUS = (
       ('draft', _('Draft')),
       ('confirmed', _('Confirmed')),
       ('done', _('Done')),
       ('cancel', _('Cancel'))
    )

    date = models.DateField()
    name = models.CharField(
        max_length=100,
        unique=True)
    origin = models.CharField(max_length=100)
    purchase_id = models.ForeignKey(
        'purchase.PurchaseOrder',
        on_delete=models.CASCADE)
    sale_id = models.ForeignKey(
      'sale.SaleOrder',
      on_delete=models.CASCADE)
    picking_id = models.ForeignKey(
        StockPicking,
        on_delete=models.CASCADE)
    quantity_done = models.IntegerField()
    product_qty = models.IntegerField()
    state = models.CharField(
        max_length=20,
        choices=STATUS,
        default='draft',)

