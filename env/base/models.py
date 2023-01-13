from django.db import models

# Create your models here.
class ResPartner(models.Model):
    
    active = models.BooleanField()
    name = models.CharField(max_length=100)
    birth_date = models.DateField()
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    is_company = models.BooleanField()
    mobile = models.CharField(max_length=15)
    parent_id = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE)
    phone = models.CharField(max_length=15)
    ref = models.CharField(max_length=100)
    rfc = models.CharField(max_length=15)
    cp = models.CharField(max_length=5)