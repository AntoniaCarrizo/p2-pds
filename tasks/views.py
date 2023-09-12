from django.shortcuts import render
from rest_framework import viewsets
from django.shortcuts import render
from rest_framework import viewsets
from .serializer import (
    AlternativaSerializer,
    PreguntaIndividualSerializer,
    PreguntaAlternativasSerializer,
    DiagramaSerializer,
    PreguntaCalculoSerializer,
    EstudianteSerializer,
)
from .models import (
    Alternativa,
    PreguntaIndividual,
    PreguntaAlternativas,
    Diagrama,
    PreguntaCalculo,
    Estudiante,
)

# Vistas para Alternativa
class AlternativaView(viewsets.ModelViewSet):
    serializer_class = AlternativaSerializer
    queryset = Alternativa.objects.all()

# Vistas para PreguntaIndividual
class PreguntaIndividualView(viewsets.ModelViewSet):
    serializer_class = PreguntaIndividualSerializer
    queryset = PreguntaIndividual.objects.all()

# Vistas para PreguntaAlternativas
class PreguntaAlternativasView(viewsets.ModelViewSet):
    serializer_class = PreguntaAlternativasSerializer
    queryset = PreguntaAlternativas.objects.all()

# Vistas para Diagrama
class DiagramaView(viewsets.ModelViewSet):
    serializer_class = DiagramaSerializer
    queryset = Diagrama.objects.all()

# Vistas para PreguntaCalculo
class PreguntaCalculoView(viewsets.ModelViewSet):
    serializer_class = PreguntaCalculoSerializer
    queryset = PreguntaCalculo.objects.all()

# Vistas para Estudiante
class EstudianteView(viewsets.ModelViewSet):
    serializer_class = EstudianteSerializer
    queryset = Estudiante.objects.all()

