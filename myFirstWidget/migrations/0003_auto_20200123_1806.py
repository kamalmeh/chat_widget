# Generated by Django 3.0.2 on 2020-01-23 12:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myFirstWidget', '0002_auto_20200123_1603'),
    ]

    operations = [
        migrations.AlterField(
            model_name='visitor',
            name='visitor_id',
            field=models.TextField(default='Unknown', max_length=50, verbose_name="Visitor's Unique Id"),
        ),
    ]
