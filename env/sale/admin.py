from django.contrib import admin
from sale.models import *

# Register your models here.
admin.site.register(SaleOrder)
admin.site.register(SaleOrderLine)