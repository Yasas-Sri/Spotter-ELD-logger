from rest_framework import serializers


class TripInputSerializer(serializers.Serializer):
    """Validates the four user inputs. Locations must be non-empty; cycle hours 0..70."""

    current_location = serializers.CharField(max_length=255)
    pickup_location = serializers.CharField(max_length=255)
    dropoff_location = serializers.CharField(max_length=255)
    current_cycle_used = serializers.FloatField(min_value=0, max_value=70)
    # Optional. Blank -> the trip starts "now" (handled by the HOS engine).
    departure_datetime = serializers.DateTimeField(required=False, allow_null=True)
