# Generated by Django 4.1 on 2022-08-25 15:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webserver', '0006_unique_constraints'),
    ]

    operations = [
        migrations.AlterField(
            model_name='demo',
            name='file_path',
            field=models.CharField(max_length=240, verbose_name='file_path'),
        ),
    ]