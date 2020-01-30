# Generated by Django 3.0.2 on 2020-01-23 10:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myFirstWidget', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='visitor',
            options={'verbose_name': 'Visitor', 'verbose_name_plural': 'Visitors'},
        ),
        migrations.AddField(
            model_name='visitor',
            name='visitor_id',
            field=models.TextField(default='Unknown', max_length=50, unique=True, verbose_name="Visitor's Unique Id"),
        ),
        migrations.AlterField(
            model_name='visitor',
            name='visitor_session_id',
            field=models.TextField(default='Unknown', max_length=50, unique=True, verbose_name="Visitor's Chat Session Id"),
        ),
        migrations.AlterModelTable(
            name='visitor',
            table=None,
        ),
    ]