FROM python:3.9.10-alpine3.14
WORKDIR /srv
RUN adduser -D myuser
RUN chown myuser:myuser /srv
USER myuser
COPY requirements.txt /srv/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install flask
EXPOSE 8000
COPY . /srv
ENV FLASK_APP=app
CMD ["python","app.py"]