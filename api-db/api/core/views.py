# -*- coding: utf-8 -*-

from psycopg2 import Error as PGError

from django.http import Http404
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
            return Response({'error': e.args[0].split('\n')[0]},
                status=status.HTTP_400_BAD_REQUEST)

class PartnerDetail(APIView):
    
    def get_object(self, pk):
        partners =  Partner().get({
                'where_params': [['id', '=', pk]]
            })

        return partners[0]

        if not partners:
            raise Http404

    def get(self, request, pk, format=None):
        try:
            partner = self.get_object(pk)
            serializer = PartnerSerializer(partner)
            return Response(serializer.data)
        except PGError as e:
            return Response({'error': e.args[0].split('\n')[0]},
                status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, format=None):
        try:
            partner = self.get_object(pk)
            serializer = PartnerSerializer(partner, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PGError as e:
            return Response({'error': e.args[0].split('\n')[0]},
                status=status.HTTP_400_BAD_REQUEST)

    # def delete(self, request, pk, format=None):
    #     snippet = self.get_object(pk)
    #     snippet.delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)
