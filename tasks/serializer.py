from rest_framework import serializers
from rest_framework import serializers
from .models import Alternativa, PreguntaIndividual, PreguntaAlternativas, Diagrama, PreguntaCalculo, Estudiante

class AlternativaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alternativa
        fields = '__all__'

class PreguntaIndividualSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreguntaIndividual
        fields = '__all__'
        extra_kwargs = {
            'alternativas': {'required': False},  # Configura alternativas para permitir valores nulos
        }

    def create(self, validated_data):
        alternativas_data = validated_data.pop('alternativas')
        pregunta_individual = PreguntaIndividual.objects.create(**validated_data)

        pregunta_individual.alternativas.set(alternativas_data)

        return pregunta_individual

class PreguntaAlternativasSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreguntaAlternativas
        fields = '__all__'
    
        def create(self, validated_data):
            preguntas_data = validated_data.pop('preguntas')
            pregunta_alternativa = PreguntaAlternativas.objects.create(**validated_data)

            pregunta_alternativa.alternativas.set(preguntas_data)

            return pregunta_alternativa

class DiagramaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diagrama
        fields = '__all__'

class PreguntaCalculoSerializer(serializers.ModelSerializer):
    diagrama = DiagramaSerializer()  # Serializer anidado para el diagrama

    class Meta:
        model = PreguntaCalculo
        fields = '__all__'

class EstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudiante
        fields = '__all__'
