"""Tests for log_builder: midnight splitting, 24h coverage, totals, miles."""

from datetime import datetime
from unittest import TestCase

from trips.services import hos_engine as he
from trips.services import log_builder as lb

START = datetime(2026, 1, 1, 8, 0, 0)


def legs_for(total_miles, to_pickup=100.0):
    to_pickup = min(to_pickup, total_miles)
    return [
        {'from': 'Origin', 'to': 'Pickup', 'miles': to_pickup},
        {'from': 'Pickup', 'to': 'Dropoff', 'miles': total_miles - to_pickup},
    ]


class LogBuilderTest(TestCase):
    def test_each_day_totals_24_hours(self):
        for miles in (200, 1500, 3000):
            logs = lb.build_logs(he.plan_hos(legs_for(miles), 0, START))
            for day in logs:
                total = sum(day['totals'].values())
                self.assertAlmostEqual(total, 24.0, delta=0.05,
                                       msg=f"{miles}mi {day['date']} totals != 24")

    def test_segments_cover_full_day_contiguously(self):
        logs = lb.build_logs(he.plan_hos(legs_for(1500), 0, START))
        for day in logs:
            segs = day['segments']
           
            self.assertTrue(segs[0]['start'].endswith('T00:00:00'))
            for prev, cur in zip(segs, segs[1:]):
                self.assertEqual(prev['end'], cur['start'])

    def test_midnight_split_creates_one_log_per_day(self):
       
        logs = lb.build_logs(he.plan_hos(legs_for(1500), 20.5, START))
        dates = [d['date'] for d in logs]
        self.assertEqual(dates, sorted(set(dates)), 'dates unique and ordered')
        self.assertGreaterEqual(len(logs), 3)

    def test_total_miles_conserved(self):
        logs = lb.build_logs(he.plan_hos(legs_for(1500), 0, START))
        self.assertAlmostEqual(sum(d['total_miles'] for d in logs), 1500, delta=2.0)

    def test_short_trip_single_day(self):
        logs = lb.build_logs(he.plan_hos(legs_for(200), 0, START))
        self.assertEqual(len(logs), 1)
        self.assertAlmostEqual(sum(logs[0]['totals'].values()), 24.0, delta=0.05)
