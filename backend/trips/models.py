from django.db import models


class Trip(models.Model):
    """A planned trip. Inputs are the four user fields; `result` holds the full
    computed payload (route, stops, logs, summary) so /trip/:id can re-render it."""

    current_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    current_cycle_used = models.FloatField() 

    result = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Trip {self.pk}: {self.pickup_location} -> {self.dropoff_location}"
