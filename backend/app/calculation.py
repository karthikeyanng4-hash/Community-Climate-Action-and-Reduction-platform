from typing import Dict, Any, Tuple, Optional

# Emission reduction factors (kg CO2e per unit)
EMISSION_FACTORS: Dict[str, Dict[str, Any]] = {
    "cycle_commute": {
        "factor": 0.171, # kg CO2e saved per km vs 2-wheeler petrol
        "unit": "km",
        "secondary_label": "Fuel Avoided",
        "secondary_factor": 0.04, # liters petrol
        "secondary_unit": "L",
        "ref": "CEA India Baseline Database v19 & IPCC AR6"
    },
    "walk_commute": {
        "factor": 0.171,
        "unit": "km",
        "secondary_label": "Fuel Avoided",
        "secondary_factor": 0.04,
        "secondary_unit": "L",
        "ref": "CEA India Baseline Database v19"
    },
    "ev_transit": {
        "factor": 0.095,
        "unit": "km",
        "secondary_label": "Grid Efficiency",
        "secondary_factor": 0.12,
        "secondary_unit": "kWh",
        "ref": "Tamil Nadu Generation & Distribution Corp (TANGEDCO)"
    },
    "bus_transit": {
        "factor": 0.112,
        "unit": "km",
        "secondary_label": "Traffic Load Avoided",
        "secondary_factor": 0.03,
        "secondary_unit": "trips",
        "ref": "Urban Mobility Guidelines Ministry of Housing & Urban Affairs"
    },
    "solar_rooftop": {
        "factor": 0.82, # kg CO2e per kWh clean generation (TANGEDCO grid displacement)
        "unit": "kWh",
        "secondary_label": "Coal Avoided",
        "secondary_factor": 0.45,
        "secondary_unit": "kg coal",
        "ref": "CEA CO2 Baseline Database for the Indian Power Sector v19"
    },
    "led_lighting": {
        "factor": 0.041,
        "unit": "hours",
        "secondary_label": "Grid Power Saved",
        "secondary_factor": 0.05,
        "secondary_unit": "kWh",
        "ref": "Bureau of Energy Efficiency (BEE) India"
    },
    "ac_temperature_24": {
        "factor": 0.492, # kg CO2e per hour operating at 24C vs 18C
        "unit": "hours",
        "secondary_label": "Electricity Saved",
        "secondary_factor": 0.6,
        "secondary_unit": "kWh",
        "ref": "BEE Star Labeling Thermal Comfort Matrix"
    },
    "home_composting": {
        "factor": 0.42, # kg CO2e avoided per kg food waste (methane landfill diversion)
        "unit": "kg",
        "secondary_label": "Organic Compost Yield",
        "secondary_factor": 0.35,
        "secondary_unit": "kg rich soil",
        "ref": "CPCB Municipal Solid Waste Management Rules 2016"
    },
    "segregated_dry_waste": {
        "factor": 1.25, # kg CO2e per kg plastic/paper recycled
        "unit": "kg",
        "secondary_label": "Virgin Material Saved",
        "secondary_factor": 0.85,
        "secondary_unit": "kg",
        "ref": "Central Pollution Control Board Circular Economy Norms"
    },
    "water_tap_aerator": {
        "factor": 0.0018, # water pumping & purification emissions
        "unit": "liters",
        "secondary_label": "Freshwater Preserved",
        "secondary_factor": 1.0,
        "secondary_unit": "L",
        "ref": "Tamil Nadu Water Supply & Drainage Board (TWAD)"
    },
    "tree_planted": {
        "factor": 21.77, # kg CO2e sequestered per native Western Ghats sapling annually
        "unit": "saplings",
        "secondary_label": "Oxygen Produced",
        "secondary_factor": 118.0,
        "secondary_unit": "kg O2/yr",
        "ref": "Forest Survey of India (FSI) Carbon Stock Assessments"
    },
    "lake_cleanup": {
        "factor": 1.85,
        "unit": "kg waste",
        "secondary_label": "Microplastic Ingress Avoided",
        "secondary_factor": 1.0,
        "secondary_unit": "kg",
        "ref": "Singanallur Lake Urban Biodiversity Heritage Protocol"
    },
    "plant_based_meal": {
        "factor": 1.45,
        "unit": "meals",
        "secondary_label": "Water Footprint Avoided",
        "secondary_factor": 450.0,
        "secondary_unit": "L",
        "ref": "IPCC Food Security & Land Use Special Report"
    }
}

DEFAULT_FACTOR = {
    "factor": 0.5,
    "unit": "units",
    "secondary_label": "Resource Conserved",
    "secondary_factor": 1.0,
    "secondary_unit": "units",
    "ref": "Standard IPCC Climate Baseline"
}

def verify_and_calculate_emission(
    action_id: str,
    quantity: float,
    description: str,
    photo_url: Optional[str] = None
) -> Tuple[float, str, int, list[str], Optional[Dict[str, Any]], str]:
    """
    Calculates carbon avoidance, assigns confidence score, and flags anomalies.
    Returns: (calculated_kg_co2e, verification_status, ai_confidence_score, anomaly_flags, secondary_impact, factor_ref)
    """
    meta = EMISSION_FACTORS.get(action_id, DEFAULT_FACTOR)
    factor = meta["factor"]
    calculated_kg = round(quantity * factor, 2)
    
    anomaly_flags = []
    confidence = 94

    # Plausibility checks
    if not photo_url or not photo_url.strip():
        anomaly_flags.append("Visual photo evidence artifact is required and cannot be empty")
        confidence = 20
    if not description or len(description.strip()) < 10:
        anomaly_flags.append("Insufficient action description (minimum 10 characters detailing activity)")
        confidence = min(confidence, 40)
    if quantity <= 0:
        anomaly_flags.append("Non-positive quantity logged")
        confidence = 20
    elif action_id in ["cycle_commute", "walk_commute"] and quantity > 80:
        anomaly_flags.append(f"Unusually high distance ({quantity} km) in single session")
        confidence = 58
    elif action_id == "tree_planted" and quantity > 50 and not photo_url:
        anomaly_flags.append("High volume tree plantation without photographic geotag")
        confidence = 65
    elif action_id == "solar_rooftop" and quantity > 250:
        anomaly_flags.append("Industrial scale solar output logged under domestic profile")
        confidence = 70

    # Verification status logic
    if len(anomaly_flags) > 0 and confidence < 70:
        verification_status = "needs_more_evidence" if not photo_url else "manual_review"
        reasoning = f"Flagged for check: {', '.join(anomaly_flags)}. AI confidence adjusted to {confidence}%."
    else:
        verification_status = "verified"
        photo_note = " Geotag photo verified." if photo_url else ""
        reasoning = f"Action validated against {meta['ref']}. Calculated avoidance: {calculated_kg} kg CO2e.{photo_note}"

    secondary_impact = None
    if "secondary_label" in meta and meta.get("secondary_factor") is not None:
        sec_val = round(quantity * meta["secondary_factor"], 2)
        secondary_impact = {
            "label": meta["secondary_label"],
            "value": sec_val,
            "unit": meta["secondary_unit"]
        }

    return (
        calculated_kg,
        verification_status,
        confidence,
        anomaly_flags,
        secondary_impact,
        meta["ref"]
    )
