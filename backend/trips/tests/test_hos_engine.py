"""Accuracy tests for the HOS engine. These are the graded core's safety net."""

from datetime import datetime
from unittest import TestCase

from trips.services import hos_engine as he

START = datetime(2026, 1, 1, 8, 0, 0)
EPS = 1e-4


def legs_for(total_miles, to_pickup=100.0):
    """current -> pickup -> dropoff, with a short deadhead to pickup."""
    to_pickup = min(to_pickup, total_miles)
    return [
        {'from': 'Origin City', 'to': 'Pickup City', 'miles': to_pickup},
        {'from': 'Pickup City', 'to': 'Dropoff City', 'miles': total_miles - to_pickup},
    ]


def assert_hos_valid(testcase, segments, total_miles):
    """Re-walk the output and verify every HOS limit holds. Pure invariant check."""
    
    for prev, cur in zip(segments, segments[1:]):
        testcase.assertEqual(prev['end'], cur['start'], 'segments must be contiguous')

   
    driven = sum(
        (s['end'] - s['start']).total_seconds() / 3600 * he.SPEED_MPH
        for s in segments if s['status'] == 'DRIVING'
    )
    testcase.assertAlmostEqual(driven, total_miles, delta=1.0)

   
    driving_today = window = since_break = cycle = 0.0
    for s in segments:
        hours = (s['end'] - s['start']).total_seconds() / 3600
        if s['kind'] in ('rest', 'restart'):
            driving_today = window = since_break = 0.0
            if s['kind'] == 'restart':
                cycle = 0.0
            continue
        if s['status'] == 'DRIVING':
            testcase.assertLessEqual(driving_today + hours, he.MAX_DRIVE_HOURS + EPS,
                                     '11h driving limit exceeded')
            testcase.assertLessEqual(window + hours, he.MAX_WINDOW_HOURS + EPS,
                                     '14h window exceeded')
            testcase.assertLessEqual(since_break + hours, he.DRIVE_BEFORE_BREAK + EPS,
                                     '8h-before-break exceeded')
            driving_today += hours
            since_break += hours
            cycle += hours
        else:
            if s['status'] == 'ON_DUTY':
                cycle += hours
            if hours >= he.BREAK_HOURS - EPS:
                since_break = 0.0
        window += hours
        testcase.assertLessEqual(cycle, he.CYCLE_LIMIT_HOURS + EPS, '70h cycle exceeded')


class HosEngineTest(TestCase):
    def test_short_same_day_trip(self):
       
        segs = he.plan_hos(legs_for(200), current_cycle_used=0, start_dt=START)
        assert_hos_valid(self, segs, 200)
        self.assertFalse(any(s['kind'] == 'rest' for s in segs), 'short trip needs no rest')
        self.assertTrue(any(s['kind'] == 'pickup' for s in segs))
        self.assertTrue(any(s['kind'] == 'dropoff' for s in segs))

    def test_two_day_trip_has_rest_and_fuel(self):
        
        segs = he.plan_hos(legs_for(1500), current_cycle_used=0, start_dt=START)
        assert_hos_valid(self, segs, 1500)
        self.assertGreaterEqual(sum(s['kind'] == 'rest' for s in segs), 1)
        self.assertGreaterEqual(sum(s['kind'] == 'fuel' for s in segs), 1)

    def test_long_trip_multiple_rests(self):
        segs = he.plan_hos(legs_for(3000), current_cycle_used=0, start_dt=START)
        assert_hos_valid(self, segs, 3000)
        self.assertGreaterEqual(sum(s['kind'] == 'rest' for s in segs), 2,
                                'a 3000mi trip obviously needs multiple rests')

    def test_seeded_cycle_forces_restart(self):
       
        segs = he.plan_hos(legs_for(2000), current_cycle_used=65, start_dt=START)
        assert_hos_valid(self, segs, 2000)
        self.assertTrue(any(s['kind'] == 'restart' for s in segs),
                        'seeded cycle near 70 must trigger a 34h restart')

    def test_break_after_eight_hours_driving(self):
        
        segs = he.plan_hos([{'from': 'A', 'to': 'B', 'miles': 500}],
                           current_cycle_used=0, start_dt=START)
        assert_hos_valid(self, segs, 500)

