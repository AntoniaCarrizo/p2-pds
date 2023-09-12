from django.db import models
import json

# Create your models here.

class Alternativa(models.Model):
    texto = models.CharField(max_length=1000)
    hint = models.CharField(max_length=10000)

class PreguntaIndividual(models.Model):
    enunciado = models.CharField(max_length=1000, null=True)
    respuesta_correcta = models.CharField(max_length=3, null=True)
    alternativas = models.ManyToManyField(Alternativa, blank=True, null=True)
    esta_correcta = models.BooleanField(default=False)

class PreguntaAlternativas(models.Model):
    cantidad_preguntas = models.IntegerField(default=3)
    cantidad_correctas = models.IntegerField(default=0)
    tema = models.CharField(max_length=100)
    pregunta_actual = models.IntegerField(default=1)
    preguntas = models.ManyToManyField(PreguntaIndividual, blank=True, related_name='preguntas')
    dificultad = models.IntegerField(default=0) # 0 facil, 1 media, 2 dificil

class Diagrama(models.Model):
    tipo = models.CharField(max_length=50) 
    datos = models.TextField()


class PreguntaCalculo(models.Model):
    tema = models.CharField(max_length=100)
    dificultad = models.IntegerField(default=0) #0 facil, 1 media, 2 dificil
    enunciado = models.CharField(max_length=1000)
    diagrama = models.ForeignKey(Diagrama, on_delete=models.CASCADE, blank=True)
    variables_calcular_json = models.TextField()
    hint = models.CharField(max_length=1000)

    def __str__(self):
        return self.enunciado

    def get_variables_calcular(self):
        return json.loads(self.variables_calcular_json)

    def set_variables_calcular(self, variables_calcular):
        self.variables_calcular_json = json.dumps(variables_calcular)

class Estudiante(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    
