# Generated by Django 4.1.2 on 2022-10-14 15:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_alter_demo_created_at'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='feedback',
            name='stacktrace',
        ),
        migrations.AddField(
            model_name='feedback',
            name='generated_details',
            field=models.CharField(blank=True, default='', max_length=1500, verbose_name='generated_details'),
        ),
    ]