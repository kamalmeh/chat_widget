# chat_widget

# System Requirements
## Install below packages using apt/apt-get and pip
```
apt install python3 python3-pip
apt install uwsgi
apt install postgresql
apt install python-psycopg2
pip install virtualenv
pip install django
pip install channels
pip install uwsgi
pip install psycopg2
```
## Setup Postgre database
```
sudo su - postgres
/path/to/POSTGRES_SETUP.sh
```
## Make Migrations
```
python manage.py makemigrations
python manage.py migrate
```
## Try running the server
```
python manage.py runserver
```
