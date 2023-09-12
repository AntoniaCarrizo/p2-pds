from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Crea un enrutador para las vistas basadas en ViewSets
router = DefaultRouter()

# Registra tus ViewSets en el enrutador
router.register(r'alternativas', views.AlternativaView)
router.register(r'preguntas-individuales', views.PreguntaIndividualView)
router.register(r'preguntas-alternativas', views.PreguntaAlternativasView)
router.register(r'diagramas', views.DiagramaView)
router.register(r'preguntas-calculo', views.PreguntaCalculoView)
router.register(r'estudiantes', views.EstudianteView)

# Define las rutas de tu aplicación
urlpatterns = [
    path('', include(router.urls)),
]
