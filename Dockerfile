FROM python:3.9.10-alpine3.14

WORKDIR /srv

RUN adduser -D myuser

RUN chown myuser:myuser /srv

USER myuser

RUN pip install --no-cache-dir --upgrade pip

COPY requirements.txt /srv/

RUN pip install --no-cache-dir -r /srv/requirements.txt

EXPOSE 8000

COPY . /srv/

ENV FLASK_APP=app

CMD ["python", "app/app.py"]
