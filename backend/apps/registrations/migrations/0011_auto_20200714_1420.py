# Generated by Django 3.0.3 on 2020-07-14 14:20

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('registrations', '0010_auto_20200714_1403'),
    ]

    operations = [
        migrations.AlterField(
            model_name='registration',
            name='code_expiration',
            field=models.DateTimeField(default=datetime.datetime(2020, 7, 16, 14, 19, 57, 653411, tzinfo=utc)),
        ),
    ]
