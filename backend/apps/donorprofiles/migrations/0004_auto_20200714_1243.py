# Generated by Django 3.0.3 on 2020-07-14 12:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('donorprofiles', '0003_donorprofile_country'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='donorprofile',
            name='certificates',
        ),
        migrations.RemoveField(
            model_name='donorprofile',
            name='is_valid',
        ),
        migrations.RemoveField(
            model_name='donorprofile',
            name='name',
        ),
        migrations.RemoveField(
            model_name='donorprofile',
            name='website',
        ),
    ]
