from datetime import datetime, timedelta


SPEED_MPH = 55.0       
FUEL_INTERVAL_MI = 1000.0 
FUEL_HOURS = 1.0           
PICKUP_HOURS = 1.0         
DROPOFF_HOURS = 1.0        


MAX_DRIVE_HOURS = 11.0     
MAX_WINDOW_HOURS = 14.0    
DRIVE_BEFORE_BREAK = 8.0   
BREAK_HOURS = 0.5
REST_HOURS = 10.0          
CYCLE_LIMIT_HOURS = 70.0   
RESTART_HOURS = 34.0       

EPS = 1e-6                 


class _Sim:
    """Mutable state for one simulation run."""

    def __init__(self, current_cycle_used, start_dt):
        self.clock = start_dt
        self.driving_today = 0.0    
        self.window_used = 0.0      
        self.since_break = 0.0      
        self.cycle_used = float(current_cycle_used)  
        self.miles_since_fuel = 0.0
        self.miles_done = 0.0
        self.segments = []

    def add(self, status, kind, hours, location_label, remark, *, driving=False):
        start = self.clock
        end = start + timedelta(hours=hours)
        self.segments.append({
            'status': status,
            'kind': kind,
            'start': start,
            'end': end,
            'location_label': location_label,
            'remark': remark,
            'miles_marker': round(self.miles_done, 1),
        })
        self.clock = end
        self.window_used += hours
        if driving:
            self.driving_today += hours
            self.since_break += hours
            self.cycle_used += hours
            self.miles_since_fuel += hours * SPEED_MPH
            self.miles_done += hours * SPEED_MPH
        else:
            
            if status == 'ON_DUTY':
                self.cycle_used += hours
           
            if hours >= BREAK_HOURS - EPS:
                self.since_break = 0.0

    def take_rest(self):
        self.add('SLEEPER', 'rest', REST_HOURS, _enroute(self.miles_done),
                 '10-hour off-duty rest (reset 11h & 14h clocks)')
        self.driving_today = 0.0
        self.window_used = 0.0
        self.since_break = 0.0

    def take_restart(self):
        self.add('OFF_DUTY', 'restart', RESTART_HOURS, _enroute(self.miles_done),
                 '34-hour restart (reset 70h cycle)')
        self.driving_today = 0.0
        self.window_used = 0.0
        self.since_break = 0.0
        self.cycle_used = 0.0


def _enroute(miles):
    return f"En route (mile {round(miles)})"


def plan_hos(legs, current_cycle_used=0.0, start_dt=None):
    """Simulate the trip.

    legs: ordered list of {'from','to','miles'}. The last leg ends at the dropoff;
          every earlier leg ends at the pickup (for current->pickup->dropoff that is
          leg 0 -> pickup, leg 1 -> dropoff).
    start_dt: when the driver departs. Not a given input, so it defaults to "now"
              (truncated to the minute). The caller may pass an explicit departure time.
    Returns: list of segment dicts (datetimes are python datetime objects).
    """
    if start_dt is None:
        start_dt = datetime.now().replace(second=0, microsecond=0)

    sim = _Sim(current_cycle_used, start_dt)
    last_idx = len(legs) - 1

    for i, leg in enumerate(legs):
        _drive_leg(sim, leg['miles'], leg.get('from', ''), leg.get('to', ''))
        
        if i == last_idx:
            sim.add('ON_DUTY', 'dropoff', DROPOFF_HOURS, leg.get('to', ''),
                    f"Dropoff at {leg.get('to', '')}")
        else:
            sim.add('ON_DUTY', 'pickup', PICKUP_HOURS, leg.get('to', ''),
                    f"Pickup at {leg.get('to', '')}")

    return sim.segments


def _drive_leg(sim, miles, from_label, to_label):
    """Drive `miles`, inserting rests/breaks/fuel as HOS forces them."""
    remaining = float(miles)
    first_chunk = True

    while remaining > EPS:
       
        if sim.cycle_used >= CYCLE_LIMIT_HOURS - EPS:
            sim.take_restart()
            continue
        if (sim.driving_today >= MAX_DRIVE_HOURS - EPS
                or sim.window_used >= MAX_WINDOW_HOURS - EPS):
            sim.take_rest()
            continue
        if sim.since_break >= DRIVE_BEFORE_BREAK - EPS:
            sim.add('OFF_DUTY', 'break', BREAK_HOURS, _enroute(sim.miles_done),
                    '30-minute break (after 8h driving)')
            continue

       
        hrs_to_drive_limit = MAX_DRIVE_HOURS - sim.driving_today
        hrs_to_window = MAX_WINDOW_HOURS - sim.window_used
        hrs_to_break = DRIVE_BEFORE_BREAK - sim.since_break
        hrs_to_fuel = (FUEL_INTERVAL_MI - sim.miles_since_fuel) / SPEED_MPH
        hrs_to_dest = remaining / SPEED_MPH
        drive_hours = min(hrs_to_drive_limit, hrs_to_window, hrs_to_break,
                          hrs_to_fuel, hrs_to_dest)
        if drive_hours <= EPS:
            continue  


        label = from_label if first_chunk else _enroute(sim.miles_done)
        sim.add('DRIVING', 'drive', drive_hours, label,
                f"Driving toward {to_label}", driving=True)
        remaining -= drive_hours * SPEED_MPH
        first_chunk = False


        if remaining > EPS and sim.miles_since_fuel >= FUEL_INTERVAL_MI - EPS:
            sim.add('ON_DUTY', 'fuel', FUEL_HOURS, _enroute(sim.miles_done),
                    f"Fuel stop (mile {round(sim.miles_done)})")
            sim.miles_since_fuel = 0.0
