FROM python:3.10-slim-bullseye

RUN mkdir /app
WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libpq-dev \
        build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt /tmp/requirements.txt
RUN \
    pip install --upgrade pip && \
    pip install -r /tmp/requirements.txt --no-cache-dir

EXPOSE 8000
ENTRYPOINT ["python"]
CMD ["manage.py", "runserver", "0.0.0.0:8000"]
