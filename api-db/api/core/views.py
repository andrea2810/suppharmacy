# -*- coding: utf-8 -*-
import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Partner
from .serializers import PartnerSerializer

logger = logging.getLogger('core')

class PartnerList(APIView):

    def get(self, request, format=None):
        partners = Partner.get()
        serializer = PartnerSerializer(partners, many=True)

        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = PartnerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
