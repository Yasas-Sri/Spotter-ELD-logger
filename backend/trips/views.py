from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Trip
from .serializers import TripInputSerializer
from .services.planner import build_plan
from .services.routing import RoutingError


@api_view(['POST'])
def plan_trip(request):
    """Validate input, compute the plan, persist it, return the payload with its id."""
    serializer = TripInputSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = dict(serializer.validated_data)

    # departure_datetime isn't a Trip column; pull it out and feed the engine.
    departure = data.pop('departure_datetime', None)
    if departure is not None:
        departure = departure.replace(tzinfo=None)  # engine works in naive wall-clock

    try:
        payload = build_plan(
            data['current_location'],
            data['pickup_location'],
            data['dropoff_location'],
            data['current_cycle_used'],
            api_key=settings.ORS_API_KEY,
            start_dt=departure,
        )
    except RoutingError as exc:
        # User-supplied locations we couldn't geocode/route -> a 400, not a 500.
        return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    trip = Trip.objects.create(result=payload, **data)
    return Response({'id': trip.id, **payload}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_trip(request, pk):
    """Return a previously computed trip by id (no recompute)."""
    try:
        trip = Trip.objects.get(pk=pk)
    except Trip.DoesNotExist:
        return Response({'detail': 'Trip not found.'}, status=status.HTTP_404_NOT_FOUND)
    return Response({'id': trip.id, **trip.result})
