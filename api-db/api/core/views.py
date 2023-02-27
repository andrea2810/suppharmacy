# -*- coding: utf-8 -*-

from psycopg2 import Error as PGError

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Partner
from .serializers import PartnerSerializer


class PartnerList(APIView):

    def get(self, request, format=None):
        try:
            partners = Partner().get(request.data)

            if not request.data.get('count'):
                serializer = PartnerSerializer(partners, many=True)

                return Response(serializer.data)

            return Response(partners)
        except PGError as e:
            return Response({'error': e.args[0].split('\n')[0]},
                status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):
        try:
            serializer = PartnerSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PGError as e:
            # return Response({'error': e.pgerror.split('\n')[0]},
            #     status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': e.pgerror},
                status=status.HTTP_400_BAD_REQUEST)

class PartnerDetail(APIView):
    pass
