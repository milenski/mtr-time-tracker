# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-13 21:27
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0001_initial'),
        ('companies', '0004_companies_projects'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='companies',
            name='projects',
        ),
        migrations.AddField(
            model_name='companies',
            name='projects',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='projects.Projects', verbose_name='Projects'),
        ),
    ]