# Generated by Django 3.0.3 on 2020-07-14 13:36

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('registrations', '0006_auto_20200714_1243'),
    ]

    operations = [
        migrations.AlterField(
            model_name='registration',
            name='code_expiration',
            field=models.DateTimeField(default=datetime.datetime(2020, 7, 16, 13, 36, 0, 5037, tzinfo=utc)),
        ),
    ]
