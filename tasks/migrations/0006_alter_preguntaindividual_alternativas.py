# Generated by Django 4.2.5 on 2023-09-09 05:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0005_alter_preguntaalternativas_preguntas_correctas_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='preguntaindividual',
            name='alternativas',
            field=models.ManyToManyField(blank=True, null=True, to='tasks.alternativa'),
        ),
    ]
