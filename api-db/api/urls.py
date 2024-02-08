"""api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from api.core import views

urlpatterns = [
    path('partner', views.ResPartnerList.as_view()),
    path('partner/<int:pk>', views.ResPartnerDetail.as_view()),
    path('user', views.ResUsersList.as_view()),
    path('user/<int:pk>', views.ResUsersDetail.as_view()),
    path('laboratory', views.ResLaboratoryList.as_view()),
    path('laboratory/<int:pk>', views.ResLaboratoryDetail.as_view()),
    path('drug-category', views.DrugCategoryList.as_view()),
    path('drug-category/<int:pk>', views.DrugCategoryDetail.as_view()),
    path('product', views.ProductProductList.as_view()),
    path('product/<int:pk>', views.ProductProductDetail.as_view()),
    path('purchase-order', views.PurchaseOrderList.as_view()),
    path('purchase-order/<int:pk>', views.PurchaseOrderDetail.as_view()),
    path('purchase-order-line', views.PurchaseOrderLineList.as_view()),
    path('purchase-order-line/<int:pk>', views.PurchaseOrderLineDetail.as_view()),
    path('sale-order', views.SaleOrderList.as_view()),
    path('sale-order/<int:pk>', views.SaleOrderDetail.as_view()),
    path('sale-order-line', views.SaleOrderLineList.as_view()),
    path('sale-order-line/<int:pk>', views.SaleOrderLineDetail.as_view()),
    path('stock-picking', views.StockPickingList.as_view()),
    path('stock-picking/<int:pk>', views.StockPickingDetail.as_view()),
    path('stock-move', views.StockMoveList.as_view()),
    path('stock-move/<int:pk>', views.StockMoveDetail.as_view()),
    path('stock-quant', views.StockQuantList.as_view()),
    path('stock-quant/<int:pk>', views.StockQuantDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
