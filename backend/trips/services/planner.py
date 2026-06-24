
from . import routing
from .hos_engine import plan_hos
from .log_builder import build_logs


_STOP_TYPE = {
    'pickup': 'pickup',
    'dropoff': 'dropoff',
    'fuel': 'fuel',
    'rest': 'rest',
    'break': 'break',
    'restart': 'rest',  
}


def build_plan(current_location, pickup_location, dropoff_location,
               current_cycle_used, api_key='', start_dt=None):
    """Returns the full computed payload ."""
    route = routing.plan_route(current_location, pickup_location, dropoff_location, api_key)

    legs = [{'from': leg['from'], 'to': leg['to'], 'miles': leg['distance_miles']}
            for leg in route['legs']]
    segments = plan_hos(legs, current_cycle_used, start_dt)

    logs = build_logs(segments)
    stops = _build_stops(segments, route)
    summary = _build_summary(route, logs, stops)
    summary['cycle_used_start'] = round(float(current_cycle_used), 1)

    return {
        'route': {
            'geometry': route['geometry'],
            'total_distance_miles': route['total_distance_miles'],
            'total_drive_hours': route['total_drive_hours'],
            'legs': route['legs'],
        },
        'stops': stops,
        'logs': logs,
        'summary': summary,
        'meta': {'route_source': route['source']},  
    }


def _build_stops(segments, route):
    """One stop per non-driving engine event, located on the map."""
    total_miles = route['total_distance_miles'] or 1
    waypoints = route['waypoints']
    stops = []
    for s in segments:
        kind = s['kind']
        if kind not in _STOP_TYPE:
            continue  
        if kind == 'pickup':
            lat, lng = waypoints[1]['lat'], waypoints[1]['lng']
        elif kind == 'dropoff':
            lat, lng = waypoints[-1]['lat'], waypoints[-1]['lng']
        else: 
            point = routing.point_at_fraction(
                route['geometry'], s['miles_marker'] / total_miles)
            lat, lng = (point[0], point[1]) if point else (None, None)
        stops.append({
            'type': _STOP_TYPE[kind],
            'label': s['remark'],
            'lat': lat,
            'lng': lng,
            'arrive': s['start'].isoformat(),
            'depart': s['end'].isoformat(),
            'miles_marker': s['miles_marker'],
        })
    return stops


def _build_summary(route, logs, stops):
    return {
        'total_days': len(logs),
        'total_distance_miles': route['total_distance_miles'],
        'total_driving_hours': route['total_drive_hours'],
        'rest_stops': sum(s['type'] == 'rest' for s in stops),
        'fuel_stops': sum(s['type'] == 'fuel' for s in stops),
    }
