from django.urls import path

from . import views

urlpatterns = [
    path('plan-trip/', views.plan_trip, name='plan-trip'),
    path('trips/<int:pk>/', views.get_trip, name='get-trip'),
]
