# Generated by Django 4.1.2 on 2022-10-13 17:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_rename_user_instance_user_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedback',
            name='stacktrace',
            field=models.CharField(blank=True, default='', max_length=1500, verbose_name='stacktrace'),
        ),
    ]