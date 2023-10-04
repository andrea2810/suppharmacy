# -*- coding: utf-8 -*-

from psycopg2 import Error as PGError

from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class APIViewList(APIView):
    _model = None
    _serializer = None

    def get(self, request, format=None):
        try:
            records = self._model().get(request.data)

            # if not request.data.get('count'):
            #     serializer = self._serializer(records, many=True)

            #     return Response(serializer.data)

            return Response(records)

        except PGError as e:
            return Response({'error': e.args[0].split('\n')[0]},
                status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):
        try:
            serializer = self._serializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except PGError as e:
            return Response({'error': e.args[0].split('\n')[0]},
                status=status.HTTP_400_BAD_REQUEST)


class APIViewDetail(APIView):
    _model = None
    _serializer = None
    
    def get_object(self, pk):
        record = self._model().get({
                'where_params': [['id', '=', pk]]
            })

        if not record:
            raise Http404

        return self._model(**record[0])

    def get(self, request, pk, format=None):
        try:
            record = self.get_object(pk)
            serializer = self._serializer(record)

            return Response(serializer.data)

        except PGError as e:
            return Response({'error': e.args[0].split('\n')[0]},
                status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, format=None):
        try:
            record = self.get_object(pk)
            serializer = self._serializer(record, data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except PGError as e:
            return Response({'error': e.args[0].split('\n')[0]},
                status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        record = self.get_object(pk)
        record.delete()

        return Response(status=status.HTTP_200_OK)
