# Generated by Django 4.2.5 on 2023-09-11 20:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0007_remove_preguntaalternativas_preguntas_correctas_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='preguntaindividual',
            name='enunciado',
            field=models.CharField(max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='preguntaindividual',
            name='respuesta_correcta',
            field=models.CharField(max_length=3, null=True),
        ),
    ]
