from datetime import datetime, time, timedelta

from .hos_engine import SPEED_MPH

DAY = timedelta(days=1)


def build_logs(segments):
   
    if not segments:
        return []

    trip_start = segments[0]['start']
    trip_end = segments[-1]['end']

    logs = []
    day_start = datetime.combine(trip_start.date(), time.min)
    while day_start < trip_end:
        day_end = day_start + DAY
        pieces = _day_pieces(segments, day_start, day_end)
        logs.append({
            'date': day_start.date().isoformat(),
            'segments': [_public(p) for p in pieces],
            'totals': _totals(pieces),
            'total_miles': _miles(pieces),
        })
        day_start = day_end
    return logs


def _day_pieces(segments, day_start, day_end):

    clipped = []
    for s in segments:
        start = max(s['start'], day_start)
        end = min(s['end'], day_end)
        if end > start:
            clipped.append({**s, 'start': start, 'end': end})
    clipped.sort(key=lambda p: p['start'])

    filled = []
    cursor = day_start
    for p in clipped:
        if p['start'] > cursor:
            filled.append(_off_duty(cursor, p['start'], _label_before(filled, clipped)))
        filled.append(p)
        cursor = p['end']
    if cursor < day_end:
        filled.append(_off_duty(cursor, day_end, _label_before(filled, clipped)))
    return filled


def _off_duty(start, end, location_label):
    return {
        'status': 'OFF_DUTY',
        'kind': 'off',
        'start': start,
        'end': end,
        'location_label': location_label,
        'remark': 'Off duty',
    }


def _label_before(filled, clipped):
    """Best location for an off-duty fill: where the driver currently is."""
    if filled:
        return filled[-1]['location_label']
    if clipped:
        return clipped[0]['location_label']
    return ''


def _hours(piece):
    return (piece['end'] - piece['start']).total_seconds() / 3600


def _totals(pieces):
    buckets = {'off_duty': 0.0, 'sleeper': 0.0, 'driving': 0.0, 'on_duty': 0.0}
    key = {'OFF_DUTY': 'off_duty', 'SLEEPER': 'sleeper',
           'DRIVING': 'driving', 'ON_DUTY': 'on_duty'}
    for p in pieces:
        buckets[key[p['status']]] += _hours(p)
    return {k: round(v, 2) for k, v in buckets.items()}


def _miles(pieces):
    driving = sum(_hours(p) for p in pieces if p['status'] == 'DRIVING')
    return round(driving * SPEED_MPH, 1)


def _public(piece):
        return {
        'status': piece['status'],
        'start': piece['start'].isoformat(),
        'end': piece['end'].isoformat(),
        'location_label': piece['location_label'],
        'remark': piece['remark'],
    }
