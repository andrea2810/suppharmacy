FROM python:3.10-slim-bullseye

RUN mkdir /app
WORKDIR /app

COPY ./requirements.txt /tmp
RUN \
    pip install --upgrade pip && \
    pip install -r /tmp/requirements.txt --no-cache-dir

EXPOSE 8000
ENTRYPOINT ["python"]
CMD ["manage.py", "runserver", "0.0.0.0:8000"]
