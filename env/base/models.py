from django.db import models

# Create your models here.
class ResPartner(models.Model):
    
    active = modesl.BooleanField()
    name = models.CharField()
    birth_date = models.DateField()
    city = models.CharField()
    country = modesl.CharField()
    email = models.CharField()
    is_company = modesl.BooleanField()
    mobile = fiels.CharField()
    parent_id = fields.ForeignKey(ResPartner, on_delete=models.CASCADE)
    phone = fields.CharField()
    ref = fields.CharField()
    rfc = fields.CharField()
    cp = fields.CharField()
