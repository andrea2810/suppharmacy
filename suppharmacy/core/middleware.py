# -*- coding: utf-8 -*-
from django.shortcuts import redirect

PATHS_TO_EXCLUDE = [
    '/login',
]

class SuppharmacyMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if all(path not in request.path for path in PATHS_TO_EXCLUDE) \
            and not 'user_id' in request.session:
            return redirect('login')

        response = self.get_response(request)

        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        # This code is executed just before the view is called
        pass

    def process_exception(self, request, exception):
        # This code is executed if an exception is raised
        pass

    def process_template_response(self, request, response):
        # This code is executed if the response contains a render() method
        return response
