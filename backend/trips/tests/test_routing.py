"""Tests for routing: mock route shape, speed consistency, geo interpolation.
No network — the ORS path is exercised live during manual/integration checks."""

from unittest import TestCase

from trips.services import hos_engine as he
from trips.services import routing as r


class RoutingMockTest(TestCase):
    def test_mock_route_shape(self):
        route = r.plan_route('Chicago, IL', 'Dallas, TX', 'Los Angeles, CA')
        self.assertEqual(route['source'], 'mock')
        self.assertEqual(len(route['legs']), 2)
        self.assertEqual(len(route['waypoints']), 3)
        self.assertTrue(route['geometry'])

    def test_drive_hours_consistent_with_speed(self):
        route = r.plan_route('a', 'b', 'c')
        expected = route['total_distance_miles'] / he.SPEED_MPH
        self.assertAlmostEqual(route['total_drive_hours'], expected, delta=0.05)
        self.assertAlmostEqual(
            route['total_distance_miles'],
            sum(leg['distance_miles'] for leg in route['legs']), delta=0.1)


class GeoInterpolationTest(TestCase):
    GEO = [[0.0, 0.0], [0.0, 10.0], [0.0, 20.0]]  # straight line along longitude

    def test_endpoints(self):
        self.assertEqual(r.point_at_fraction(self.GEO, 0), self.GEO[0])
        self.assertEqual(r.point_at_fraction(self.GEO, 1), self.GEO[-1])

    def test_midpoint(self):
        mid = r.point_at_fraction(self.GEO, 0.5)
        self.assertAlmostEqual(mid[1], 10.0, delta=0.5)

    def test_empty_geometry(self):
        self.assertIsNone(r.point_at_fraction([], 0.5))
