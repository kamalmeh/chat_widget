# Generated by Django 3.0.2 on 2020-01-21 12:28

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Visitor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visitor_session_id', models.TextField(max_length=50, unique=True, verbose_name="Visitor's Chat Session Id")),
            ],
            options={
                'verbose_name': 'Visitor',
                'verbose_name_plural': 'Visitors',
                'db_table': '',
                'managed': True,
            },
        ),
    ]