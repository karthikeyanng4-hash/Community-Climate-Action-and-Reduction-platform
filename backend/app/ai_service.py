from typing import Dict, Any, List, Tuple, Optional

def get_climate_assistant_response(query: str, district: str = "Coimbatore") -> Dict[str, Any]:
    """Provides structured, scientifically grounded answers to community climate queries."""
    q = query.lower()

    if "coimbatore" in q or "singanallur" in q or "valankulam" in q or "lake" in q:
        return {
            "reply": (
                f"In {district}, wetland conservation is pivotal. Singanallur Lake (Urban Biodiversity Heritage Site) "
                "and Valankulam Eco-Promenade anchor urban flood resilience and biodiversity corridors. "
                "Current grassroots interventions emphasize biomining at Vellalore, littoral reed bed desiltation, "
                "and planting native Western Ghats canopy species to reduce the urban heat island effect."
            ),
            "sources": [
                "CCMC Urban Wetland Restoration Strategy",
                "Singanallur Lake Biodiversity Heritage Report",
                "Tamil Nadu State Climate Action Plan (TNSCAP)"
            ],
            "suggestedFollowUps": [
                "What events are happening at Singanallur Lake?",
                "How do native saplings sequester more carbon?",
                "How does Vellalore biomining reduce methane?"
            ]
        }
    
    if "calculate" in q or "methodology" in q or "formula" in q or "verified" in q or "score" in q:
        return {
            "reply": (
                "Your avoided emissions are calculated using CEA India CO2 Baseline Database v19 and IPCC AR6 guidelines. "
                "For active commuting (cycling/walking), we factor in 0.171 kg CO2e saved per km displaced from petrol two-wheelers. "
                "Rooftop solar displaces 0.82 kg CO2e/kWh from the Southern Grid. Each native tree planted sequesters ~21.77 kg CO2e annually."
            ),
            "sources": [
                "CEA India Grid Emission Factor v19",
                "IPCC 2019 Refinement to 2006 Guidelines",
                "BEE India Standard Labeling Data"
            ],
            "suggestedFollowUps": [
                "Which action gives the highest carbon offset?",
                "How can I join the 7-Day Commute challenge?",
                "How are my reports reviewed?"
            ]
        }
    
    if "tree" in q or "forest" in q or "plant" in q or "miyawaki" in q:
        return {
            "reply": (
                "Native species such as Neem (Azadirachta indica), Pungan (Millettia pinnata), and Marudham (Terminalia arjuna) "
                "thrive in Western Ghats climatic conditions, requiring 60% less irrigation while supporting endemic birdlife. "
                "Ensure saplings are geolocated and photographed during monthly growth audits."
            ),
            "sources": [
                "Forest Survey of India Western Ghats Flora Index",
                "Tamil Nadu Green Mission Guidelines"
            ],
            "suggestedFollowUps": [
                "Where can I find native sapling plantation drives?",
                "How do I log a tree plantation submission?",
                "How does afforestation affect local groundwater?"
            ]
        }

    if "waste" in q or "plastic" in q or "compost" in q or "dump" in q:
        return {
            "reply": (
                "Decentralized organic waste composting prevents anaerobic decomposition in dumpsites, avoiding 0.42 kg CO2e of methane per kg. "
                "Segregating dry recyclables (PET, HDPE) avoids 1.25 kg CO2e per kg in virgin polymer synthesis. "
                "You can log both home composting and community cleanup drives on the Actions tab."
            ),
            "sources": [
                "CPCB Solid Waste Management Rules 2016",
                "Tamil Nadu Pollution Control Board Circular Economy Norms"
            ],
            "suggestedFollowUps": [
                "How does organic composting eliminate methane?",
                "Where can I report illegal waste dumping?",
                "Join the Zero Kitchen Waste Fortnight challenge"
            ]
        }

    # Default climate response
    return {
        "reply": (
            f"As an EcoCommunity member in {district}, your verified everyday choices directly update our collective dashboard. "
            "Whether adopting zero-fuel commutes, optimizing home cooling at 24°C, or restoring local waterbodies, "
            "every verified action is audited with IPCC AR6 emission factors and permanently recorded in our MySQL registry."
        ),
        "sources": [
            "IPCC Sixth Assessment Report (AR6)",
            "CEA India CO2 Baseline Database",
            "Tamil Nadu Department of Environment and Climate Change"
        ],
        "suggestedFollowUps": [
            "How is my verified impact calculated?",
            "Tell me about Coimbatore environmental data",
            "Which challenge should I join?"
        ]
    }


# =====================================================================
# Gemma 3 Vision AI Image Validation Service
# =====================================================================

import io
import re
import json
import base64
import logging
import httpx
from PIL import Image
from app.config import settings
from app.schemas import ImageValidationResult

logger = logging.getLogger("climate_ai_service")

class OllamaServiceUnavailableError(Exception):
    """Raised when Ollama server cannot be reached."""
    pass

class ImageValidationError(Exception):
    """Raised when the uploaded image is invalid, corrupted, or unsupported."""
    pass

class UnsupportedActivityError(Exception):
    """Raised when an activity name is not supported by the platform."""
    pass

# Supported Climate Activities & canonical names
SUPPORTED_ACTIVITIES: Dict[str, Dict[str, Any]] = {
    "cycling": {
        "canonical": "Cycling",
        "keywords": ["cycling", "cycle", "bicycle", "bike commute", "cycle_commute"],
        "expected_visuals": "a person riding a bicycle, a bicycle on a road/path, cycling gear, handlebars or bike frame in commute context"
    },
    "walking": {
        "canonical": "Walking",
        "keywords": ["walking", "walk", "on foot", "pedestrian", "walk_commute"],
        "expected_visuals": "a person walking outdoors, shoes/feet on a pedestrian path, fitness tracker GPS walk route"
    },
    "public transportation": {
        "canonical": "Public Transportation",
        "keywords": ["public transportation", "public transit", "bus", "metro", "train", "bus_transit", "public_transit", "ev_transit", "carpool_commute"],
        "expected_visuals": "inside a civic bus, metro train, transit ticket/pass, bus stop with transit vehicle"
    },
    "planting trees": {
        "canonical": "Planting Trees",
        "keywords": ["planting trees", "tree planting", "tree", "plant sapling", "tree_planted", "sapling", "community_garden_stewardship", "afforestation"],
        "expected_visuals": "a person planting a sapling, young tree in soil with tree guard, garden soil and roots, gardening tools"
    },
    "recycling": {
        "canonical": "Recycling",
        "keywords": ["recycling", "segregated dry waste", "segregated_dry_waste", "ewaste", "ewaste_recycling", "clothing_repair_reuse"],
        "expected_visuals": "segregated recyclable plastics/paper/cans, recycling bins, sorted waste material, e-waste dropoff items"
    },
    "using reusable products": {
        "canonical": "Using Reusable Products",
        "keywords": ["using reusable products", "reusable bag", "manjapai", "plastic_bag_avoided", "reusable bottle", "plastic_bottle_reused"],
        "expected_visuals": "reusable cloth/jute tote bag with groceries, refillable stainless steel or glass water bottle"
    },
    "solar energy": {
        "canonical": "Solar Energy",
        "keywords": ["solar energy", "solar", "solar panels", "solar_rooftop", "solar_led_upgrade", "photovoltaic"],
        "expected_visuals": "rooftop photovoltaic solar panels, solar inverter display, solar installation"
    },
    "waste reduction": {
        "canonical": "Waste Reduction",
        "keywords": ["waste reduction", "composting", "home_composting", "diverted_compost", "zero_waste_day", "food_waste_prevention", "lake_cleanup"],
        "expected_visuals": "kitchen organic waste in compost bin, aerobic compost khamba, zero-waste meal prep containers, collected lake trash"
    },
    "water conservation": {
        "canonical": "Water Conservation",
        "keywords": ["water conservation", "low_flow_aerator", "water_tap_aerator", "rainwater_harvesting"],
        "expected_visuals": "water-saving tap aerator installed on faucet, rainwater recharge percolation pit or filter mesh"
    },
    "energy efficiency": {
        "canonical": "Energy Efficiency",
        "keywords": ["energy efficiency", "ac_temp_24c", "ac_temperature_24", "ac_reduced_usage", "appliance_vampire_off"],
        "expected_visuals": "air conditioner remote LCD or wall unit displaying 24C or higher, switchboard switched off at wall"
    }
}

def normalize_activity_name(activity_input: str) -> Tuple[str, Dict[str, Any]]:
    """Validates and normalizes user-provided activity name against supported climate activities."""
    if not activity_input or not activity_input.strip():
        raise UnsupportedActivityError("Activity name is required and cannot be empty.")

    cleaned = activity_input.strip().lower().replace("-", " ").replace("_", " ")

    # Direct keyword or key match
    for key, meta in SUPPORTED_ACTIVITIES.items():
        if key == cleaned or meta["canonical"].lower() == cleaned:
            return meta["canonical"], meta
        for kw in meta["keywords"]:
            clean_kw = kw.lower().replace("-", " ").replace("_", " ")
            if clean_kw == cleaned or clean_kw in cleaned:
                return meta["canonical"], meta

    # Exact word containment match
    for key, meta in SUPPORTED_ACTIVITIES.items():
        if any(w in cleaned.split() for w in key.split()):
            return meta["canonical"], meta

    supported_list = ", ".join(m["canonical"] for m in SUPPORTED_ACTIVITIES.values())
    raise UnsupportedActivityError(
        f"Activity '{activity_input}' is not supported. Supported activities include: {supported_list}."
    )

def validate_and_extract_image_base64(raw_image_str: str) -> str:
    """
    Validates uploaded image format, size limits, and checks for corruption.
    Returns clean raw base64 string.
    """
    if not raw_image_str or not isinstance(raw_image_str, str) or not raw_image_str.strip():
        raise ImageValidationError("Image payload is required and cannot be empty.")

    # Remove data URI header if present (e.g., 'data:image/jpeg;base64,...')
    clean_b64 = raw_image_str.strip()
    if "," in clean_b64:
        clean_b64 = clean_b64.split(",", 1)[1].strip()

    # Enforce reasonable size limit (10MB binary ~ 13.5MB base64)
    if len(clean_b64) > 15 * 1024 * 1024:
        raise ImageValidationError("Image file exceeds maximum allowable size (10 MB limit).")

    # Verify base64 decoding
    try:
        image_bytes = base64.b64decode(clean_b64, validate=True)
    except Exception as e:
        raise ImageValidationError(f"Invalid base64 image encoding: {str(e)}")

    if len(image_bytes) < 32:
        raise ImageValidationError("Image payload is too small to be a valid image file.")

    # Validate image header and readability with PIL
    try:
        with Image.open(io.BytesIO(image_bytes)) as img:
            img.verify()
            fmt = img.format
            if fmt not in ["JPEG", "PNG", "WEBP", "GIF"]:
                raise ImageValidationError(f"Unsupported image format: '{fmt}'. Please upload JPEG, PNG, or WebP.")
    except ImageValidationError:
        raise
    except Exception as e:
        raise ImageValidationError(f"Corrupted or unreadable image file: {str(e)}")

    return clean_b64

def sanitize_user_description(description: Optional[str]) -> str:
    """Sanitizes user-supplied description to prevent prompt injection."""
    if not description:
        return ""
    # Strip dangerous characters, truncate, and ensure plain text
    sanitized = re.sub(r"[\r\n\t]+", " ", description.strip())
    sanitized = re.sub(r"[^\w\s\.,;:!?\(\)\-]", "", sanitized)
    return sanitized[:200]

def build_gemma3_prompt(activity_canonical: str, activity_meta: Dict[str, Any], sanitized_desc: str) -> str:
    """Builds a strict structured evaluation prompt for Gemma 3 Vision."""
    desc_clause = f'\nUser claims: "{sanitized_desc}" (Do not accept this claim blindly; verify visual proof).' if sanitized_desc else ""

    return f"""You are a strict AI Climate Evidence Auditor.
Your task is to inspect the attached image and determine whether it provides genuine visual evidence of the following climate activity:
Selected Activity: "{activity_canonical}"
Expected visual evidence includes: {activity_meta['expected_visuals']}.{desc_clause}

STRICT EVALUATION INSTRUCTIONS:
1. Examine the actual visual content: identify visible objects, human actions, setting, and context.
2. The image is RELEVANT (relevant: true) ONLY IF it shows genuine visual proof of "{activity_canonical}".
3. If the image shows an unrelated activity, an indoor room without relevance, restaurant dining when activity is cycling, cycling when activity is tree planting, random objects, or lacks clear proof of "{activity_canonical}", mark it NOT RELEVANT (relevant: false).
4. If the image is blurry, ambiguous, or lacks sufficient detail to confirm "{activity_canonical}", mark it NOT RELEVANT (relevant: false) with an appropriate confidence score (e.g., 0.50-0.65).
5. Do NOT trust text claims or filenames without visual confirmation in the photo.

Respond ONLY with a valid JSON object matching this exact schema:
{{
  "relevant": true or false,
  "confidence": float number between 0.0 and 1.0,
  "activity": "{activity_canonical}",
  "reason": "Concise 1-2 sentence explanation of what is visually visible in the image and why it does or does not prove {activity_canonical}."
}}
"""

def parse_gemma3_response(raw_text: str, activity_canonical: str) -> Dict[str, Any]:
    """Safely parses structured JSON response from Gemma 3 Vision."""
    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\n?", "", cleaned)
        cleaned = re.sub(r"\n?```$", "", cleaned)
        cleaned = cleaned.strip()

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        # Fallback regex extraction if model output includes commentary
        json_match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if json_match:
            try:
                data = json.loads(json_match.group(0))
            except Exception:
                data = {}
        else:
            data = {}

    relevant = bool(data.get("relevant", False))
    raw_confidence = data.get("confidence", 0.5 if not relevant else 0.85)

    try:
        confidence = float(raw_confidence)
        if confidence > 1.0 and confidence <= 100.0:
            confidence = confidence / 100.0
        confidence = max(0.0, min(1.0, round(confidence, 2)))
    except (ValueError, TypeError):
        confidence = 0.85 if relevant else 0.50

    reason = str(data.get("reason") or "").strip()
    if not reason:
        reason = (
            f"The image provides visual confirmation of {activity_canonical}."
            if relevant
            else f"The image does not provide sufficient visual evidence of {activity_canonical}."
        )

    return {
        "relevant": relevant,
        "confidence": confidence,
        "activity": activity_canonical,
        "reason": reason
    }

def apply_authoritative_decision(parsed: Dict[str, Any], activity_canonical: str) -> ImageValidationResult:
    """
    Applies the backend acceptance policy:
    - Clearly relevant (relevant=True, confidence >= 0.70) -> Accepted
    - Low confidence / ambiguous (confidence < 0.70) -> Rejected (needs clearer photo)
    - Irrelevant (relevant=False) -> Rejected
    """
    relevant = parsed["relevant"]
    confidence = parsed["confidence"]
    reason = parsed["reason"]

    if relevant and confidence >= 0.70:
        accepted = True
        status = "verified"
    elif relevant and confidence < 0.70:
        accepted = False
        status = "needs_more_evidence"
        reason = f"{reason} (Visual evidence is ambiguous with confidence {int(confidence*100)}%. Please provide a clearer photo)."
    else:
        accepted = False
        status = "rejected"

    return ImageValidationResult(
        relevant=relevant,
        confidence=confidence,
        activity=activity_canonical,
        reason=reason,
        accepted=accepted,
        status=status
    )

async def validate_activity_image_async(
    image_input: str,
    activity_name: str,
    description: Optional[str] = None
) -> ImageValidationResult:
    """
    Asynchronously validates an image against a selected climate activity using Ollama Gemma 3 Vision.
    Performs security checks, multimodal payload generation, and authoritative acceptance logic.
    """
    canonical_name, meta = normalize_activity_name(activity_name)
    clean_b64 = validate_and_extract_image_base64(image_input)
    sanitized_desc = sanitize_user_description(description)
    prompt = build_gemma3_prompt(canonical_name, meta, sanitized_desc)

    payload = {
        "model": settings.OLLAMA_MODEL,
        "messages": [
            {
                "role": "user",
                "content": prompt,
                "images": [clean_b64]
            }
        ],
        "format": "json",
        "stream": False,
        "options": {
            "temperature": 0.1
        }
    }

    url = f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/chat"

    try:
        async with httpx.AsyncClient(timeout=settings.OLLAMA_TIMEOUT_SECONDS) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code != 200:
                logger.error(f"Ollama returned HTTP {resp.status_code}: {resp.text}")
                raise OllamaServiceUnavailableError(
                    f"Ollama server returned error status {resp.status_code}."
                )
            res_json = resp.json()
    except (httpx.ConnectError, httpx.ConnectTimeout, httpx.ReadTimeout) as e:
        logger.error(f"Failed to reach Ollama at {url}: {e}")
        raise OllamaServiceUnavailableError(
            "AI validation service is currently unavailable. Please verify that Ollama is running."
        )
    except OllamaServiceUnavailableError:
        raise
    except Exception as e:
        logger.error(f"Unexpected error communicating with Ollama: {e}")
        raise OllamaServiceUnavailableError(f"Ollama communication error: {str(e)}")

    content = res_json.get("message", {}).get("content", "")
    parsed = parse_gemma3_response(content, canonical_name)
    return apply_authoritative_decision(parsed, canonical_name)

def validate_activity_image(
    image_input: str,
    activity_name: str,
    description: Optional[str] = None
) -> ImageValidationResult:
    """Synchronous wrapper for validate_activity_image_async."""
    import asyncio
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

    if loop.is_running():
        # In case called from an already running loop without await
        import concurrent.futures
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future = executor.submit(
                asyncio.run,
                validate_activity_image_async(image_input, activity_name, description)
            )
            return future.result()
    else:
        return loop.run_until_complete(
            validate_activity_image_async(image_input, activity_name, description)
        )
