from django.contrib import admin
from purchase.models import *

# Register your models here.
admin.site.register(PurchaseOrder)
admin.site.register(PurchaseOrderLine)