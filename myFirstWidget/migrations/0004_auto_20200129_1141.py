# Generated by Django 3.0.2 on 2020-01-29 06:11

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('myFirstWidget', '0003_auto_20200123_1806'),
    ]

    operations = [
        migrations.CreateModel(
            name='Current_Logged_On_User',
            fields=[
                ('session_id', models.TextField(db_index=True, default='Unknown', max_length=128, primary_key=True, serialize=False, unique=True, verbose_name="Visitor's Chat Session Id")),
                ('client_id', models.TextField(default='Unknown', max_length=128, verbose_name="Visitor's Unique Client Id")),
            ],
            options={
                'verbose_name': 'Current_Logged_On_User',
                'verbose_name_plural': 'Current_Logged_On_Users',
            },
        ),
        migrations.RemoveField(
            model_name='visitor',
            name='id',
        ),
        migrations.RemoveField(
            model_name='visitor',
            name='visitor_id',
        ),
        migrations.RemoveField(
            model_name='visitor',
            name='visitor_session_id',
        ),
        migrations.AddField(
            model_name='visitor',
            name='Date & Time',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='Date Time of Visitor'),
        ),
        migrations.AddField(
            model_name='visitor',
            name='client_id',
            field=models.TextField(default='Unknown', max_length=128, verbose_name="Visitor's Unique Client Id"),
        ),
        migrations.AddField(
            model_name='visitor',
            name='first_name',
            field=models.TextField(default='Unknown', max_length=50, null=True, verbose_name="Visitor's First Name"),
        ),
        migrations.AddField(
            model_name='visitor',
            name='last_name',
            field=models.TextField(default='Unknown', max_length=50, null=True, verbose_name="Visitor's Last Name"),
        ),
        migrations.AddField(
            model_name='visitor',
            name='session_id',
            field=models.TextField(db_index=True, default='Unknown', max_length=128, primary_key=True, serialize=False, unique=True, verbose_name="Visitor's Chat Session Id"),
        ),
        migrations.CreateModel(
            name='ChatHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('session_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='history', to='myFirstWidget.Visitor')),
            ],
            options={
                'verbose_name': 'ChatHistory',
                'verbose_name_plural': 'ChatHistory',
            },
        ),
    ]
