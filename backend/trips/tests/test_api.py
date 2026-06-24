"""Endpoint tests. Forces the mock route (no network) via overridden settings."""

from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

VALID = {
    'current_location': 'Chicago, IL',
    'pickup_location': 'Dallas, TX',
    'dropoff_location': 'Los Angeles, CA',
    'current_cycle_used': 20.5,
}


@override_settings(ORS_API_KEY='') 
class PlanTripApiTest(APITestCase):
    def test_plan_trip_creates_and_returns_payload(self):
        resp = self.client.post('/api/plan-trip/', VALID, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        body = resp.json()
        self.assertIn('id', body)
        for key in ('route', 'stops', 'logs', 'summary'):
            self.assertIn(key, body)
        self.assertGreater(len(body['logs']), 0)
       
        for day in body['logs']:
            self.assertAlmostEqual(sum(day['totals'].values()), 24.0, delta=0.05)

    def test_get_trip_returns_saved_plan(self):
        created = self.client.post('/api/plan-trip/', VALID, format='json').json()
        resp = self.client.get(f"/api/trips/{created['id']}/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.json()['id'], created['id'])

    def test_get_missing_trip_404s(self):
        resp = self.client.get('/api/trips/999999/')
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_cycle_out_of_range_rejected(self):
        bad = {**VALID, 'current_cycle_used': 80}
        resp = self.client.post('/api/plan-trip/', bad, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_blank_location_rejected(self):
        bad = {**VALID, 'pickup_location': ''}
        resp = self.client.post('/api/plan-trip/', bad, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
