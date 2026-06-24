import requests

from .hos_engine import SPEED_MPH

GEOCODE_URL = 'https://api.openrouteservice.org/geocode/search'
DIRECTIONS_URL = 'https://api.openrouteservice.org/v2/directions/driving-hgv/geojson'
METERS_PER_MILE = 1609.344
TIMEOUT = 20  


class RoutingError(Exception):
    """Raised when a location can't be geocoded or a route can't be built."""


def plan_route(current, pickup, dropoff, api_key=''):
    """current -> pickup -> dropoff. Returns the route dict used by the API layer."""
    if not api_key:
        return _mock_route(current, pickup, dropoff)

    labels = [current, pickup, dropoff]
    coords = [_geocode(text, api_key) for text in labels] 
    geo, seg_distances = _directions(coords, api_key)

    legs = []
    for i, meters in enumerate(seg_distances):
        miles = meters / METERS_PER_MILE
        legs.append({
            'from': labels[i],
            'to': labels[i + 1],
            'distance_miles': round(miles, 1),
            'duration_hours': round(miles / SPEED_MPH, 2),
        })
    total_miles = sum(leg['distance_miles'] for leg in legs)
    return {
        'geometry': [[lat, lng] for lng, lat in geo],  
        'total_distance_miles': round(total_miles, 1),
        'total_drive_hours': round(total_miles / SPEED_MPH, 2),
        'legs': legs,
        'waypoints': [
            {'label': labels[i], 'lat': c[1], 'lng': c[0]} for i, c in enumerate(coords)
        ],
        'source': 'ors',
    }


def _geocode(text, api_key):
    """Resolve a place name to [lng, lat]."""
    try:
        resp = requests.get(
            GEOCODE_URL,
            params={'api_key': api_key, 'text': text, 'size': 1},
            timeout=TIMEOUT,
        )
        resp.raise_for_status()
        features = resp.json().get('features', [])
    except requests.RequestException as exc:
        raise RoutingError(f"Geocoding failed for '{text}': {exc}") from exc
    if not features:
        raise RoutingError(f"Could not find a location for '{text}'.")
    return features[0]['geometry']['coordinates']  # [lng, lat]


def _directions(coords, api_key):
    """Returns (geometry [[lng,lat],...], [leg_distance_meters, ...])."""
    try:
        resp = requests.post(
            DIRECTIONS_URL,

            json={'coordinates': coords, 'radiuses': [-1] * len(coords)},
            headers={'Authorization': api_key},
            timeout=TIMEOUT,
        )
        if resp.status_code >= 400:
            raise RoutingError(_ors_error(resp))
        feature = resp.json()['features'][0]
    except requests.RequestException as exc:
        raise RoutingError(f"Routing failed: {exc}") from exc
    except (KeyError, IndexError) as exc:
        raise RoutingError('Routing returned no usable route for these locations.') from exc
    geometry = feature['geometry']['coordinates']
    seg_distances = [s['distance'] for s in feature['properties']['segments']]
    return geometry, seg_distances


def _ors_error(resp):
    """Turn an ORS error response into a driver-readable message."""
    try:
        err = resp.json().get('error', {})
        msg = err.get('message') if isinstance(err, dict) else str(err)
    except ValueError:
        msg = None
    if not msg:
        return f"Routing failed ({resp.status_code}). Try nearby city names."
    return f"Could not route these locations: {msg}"


def point_at_fraction(geometry, fraction):
    """Point [lat,lng] at `fraction` (0..1) along the polyline, by cumulative length.
    Used to place en-route stop markers (fuel/rest/break) at their mile marker."""
    if not geometry:
        return None
    if fraction <= 0:
        return geometry[0]
    if fraction >= 1:
        return geometry[-1]

    spans = [_haversine(a, b) for a, b in zip(geometry, geometry[1:])]
    total = sum(spans)
    if total == 0:
        return geometry[0]
    target = fraction * total
    acc = 0.0
    for (a, b), span in zip(zip(geometry, geometry[1:]), spans):
        if acc + span >= target:
            t = (target - acc) / span if span else 0
            return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
        acc += span
    return geometry[-1]


def _haversine(a, b):
    """Approximate great-circle distance between [lat,lng] points (any unit; relative)."""
    from math import radians, sin, cos, asin, sqrt
    lat1, lon1, lat2, lon2 = map(radians, (a[0], a[1], b[0], b[1]))
    h = sin((lat2 - lat1) / 2) ** 2 + cos(lat1) * cos(lat2) * sin((lon2 - lon1) / 2) ** 2
    return 2 * asin(sqrt(h))  


def _mock_route(current, pickup, dropoff):
    """Dev/test stand-in. NOT used when ORS_API_KEY is set."""
    waypoints = [
        {'label': current, 'lat': 41.8781, 'lng': -87.6298},  
        {'label': pickup, 'lat': 32.7767, 'lng': -96.7970},    
        {'label': dropoff, 'lat': 34.0522, 'lng': -118.2437},  
    ]
    legs = [
        {'from': current, 'to': pickup, 'distance_miles': 925.0,
         'duration_hours': round(925.0 / SPEED_MPH, 2)},
        {'from': pickup, 'to': dropoff, 'distance_miles': 1435.0,
         'duration_hours': round(1435.0 / SPEED_MPH, 2)},
    ]
    total_miles = sum(leg['distance_miles'] for leg in legs)
    return {
        'geometry': [[w['lat'], w['lng']] for w in waypoints],
        'total_distance_miles': total_miles,
        'total_drive_hours': round(total_miles / SPEED_MPH, 2),
        'legs': legs,
        'waypoints': waypoints,
        'source': 'mock',
    }
