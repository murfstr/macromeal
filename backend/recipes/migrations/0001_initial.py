# Generated by Django 5.1.4 on 2024-12-18 16:53

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Recipe',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('calories', models.IntegerField(default=2000)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
