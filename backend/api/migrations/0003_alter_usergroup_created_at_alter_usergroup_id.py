# Generated by Django 4.1.2 on 2022-10-25 15:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_usergroup_created_at_alter_usergroup_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usergroup',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, verbose_name='created at'),
        ),
        migrations.AlterField(
            model_name='usergroup',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False, verbose_name='id'),
        ),
    ]