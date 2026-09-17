"""
Test suite for AI Image Validation with Ollama & Gemma 3 Vision.
Tests all 6 required scenarios:
  TEST 1: Activity = Cycling, Image = person riding bicycle -> relevant: true, accepted: true
  TEST 2: Activity = Cycling, Image = unrelated scene -> relevant: false, accepted: false
  TEST 3: Activity = Planting Trees, Image = person planting a tree -> relevant: true, accepted: true
  TEST 4: Activity = Planting Trees, Image = person riding bicycle -> relevant: false, accepted: false
  TEST 5: Invalid/corrupted image -> clean validation error (HTTP 400)
  TEST 6: Ollama server unavailable -> clean backend error (HTTP 503)
"""

import os
import sys
import base64
import json
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from main import app
from app.config import settings

client = TestClient(app)

# Test image paths
CYCLING_IMG_PATH = r"C:\Users\Karthick\.gemini\antigravity-ide\brain\163f4a57-ebd3-4244-9382-a606e4994f00\cycling_action_1789578442214.jpg"
DINING_IMG_PATH = r"C:\Users\Karthick\.gemini\antigravity-ide\brain\163f4a57-ebd3-4244-9382-a606e4994f00\unrelated_dining_1789578483978.jpg"
PLANTING_IMG_PATH = r"C:\Users\Karthick\.gemini\antigravity-ide\brain\163f4a57-ebd3-4244-9382-a606e4994f00\planting_tree_action_1789578524723.jpg"

def load_image_as_b64(path: str) -> str:
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def run_tests():
    print("==================================================")
    print("Starting AI Image Validation Test Suite (Gemma 3)")
    print("==================================================")

    cycling_b64 = load_image_as_b64(CYCLING_IMG_PATH)
    dining_b64 = load_image_as_b64(DINING_IMG_PATH)
    planting_b64 = load_image_as_b64(PLANTING_IMG_PATH)

    results = []

    # TEST 1: Activity = Cycling, Image = Person riding bicycle
    print("\n--- Running TEST 1: Activity = Cycling | Image = Cycling photo ---")
    resp1 = client.post("/api/ai/validate-image", json={
        "activity": "Cycling",
        "image": f"data:image/jpeg;base64,{cycling_b64}",
        "description": "Morning bicycle commute along the road"
    })
    print(f"Status Code: {resp1.status_code}")
    data1 = resp1.json()
    print(f"Response: {json.dumps(data1, indent=2)}")
    assert resp1.status_code == 200, f"Expected 200, got {resp1.status_code}"
    assert data1["relevant"] is True, f"Expected relevant=True, got {data1['relevant']}"
    assert data1["accepted"] is True, f"Expected accepted=True, got {data1['accepted']}"
    assert data1["activity"] == "Cycling"
    assert data1["confidence"] >= 0.70
    results.append(("TEST 1 (Cycling + Bicycle)", "PASSED"))

    # TEST 2: Activity = Cycling, Image = Unrelated dining scene
    print("\n--- Running TEST 2: Activity = Cycling | Image = Restaurant dining ---")
    resp2 = client.post("/api/ai/validate-image", json={
        "activity": "Cycling",
        "image": f"data:image/jpeg;base64,{dining_b64}",
        "description": "Rode bike to restaurant"
    })
    print(f"Status Code: {resp2.status_code}")
    data2 = resp2.json()
    print(f"Response: {json.dumps(data2, indent=2)}")
    assert resp2.status_code == 200, f"Expected 200, got {resp2.status_code}"
    assert data2["relevant"] is False, f"Expected relevant=False, got {data2['relevant']}"
    assert data2["accepted"] is False, f"Expected accepted=False, got {data2['accepted']}"
    results.append(("TEST 2 (Cycling + Restaurant Dining)", "PASSED"))

    # TEST 3: Activity = Planting Trees, Image = Person planting a tree
    print("\n--- Running TEST 3: Activity = Planting Trees | Image = Planting sapling ---")
    resp3 = client.post("/api/ai/validate-image", json={
        "activity": "Planting Trees",
        "image": f"data:image/jpeg;base64,{planting_b64}",
        "description": "Planting a native sapling in local garden soil"
    })
    print(f"Status Code: {resp3.status_code}")
    data3 = resp3.json()
    print(f"Response: {json.dumps(data3, indent=2)}")
    assert resp3.status_code == 200, f"Expected 200, got {resp3.status_code}"
    assert data3["relevant"] is True, f"Expected relevant=True, got {data3['relevant']}"
    assert data3["accepted"] is True, f"Expected accepted=True, got {data3['accepted']}"
    assert data3["activity"] == "Planting Trees"
    results.append(("TEST 3 (Planting Trees + Sapling)", "PASSED"))

    # TEST 4: Activity = Planting Trees, Image = Person riding bicycle
    print("\n--- Running TEST 4: Activity = Planting Trees | Image = Cycling photo ---")
    resp4 = client.post("/api/ai/validate-image", json={
        "activity": "Planting Trees",
        "image": f"data:image/jpeg;base64,{cycling_b64}",
        "description": "Planting trees after cycling"
    })
    print(f"Status Code: {resp4.status_code}")
    data4 = resp4.json()
    print(f"Response: {json.dumps(data4, indent=2)}")
    assert resp4.status_code == 200, f"Expected 200, got {resp4.status_code}"
    assert data4["relevant"] is False, f"Expected relevant=False, got {data4['relevant']}"
    assert data4["accepted"] is False, f"Expected accepted=False, got {data4['accepted']}"
    results.append(("TEST 4 (Planting Trees + Cycling)", "PASSED"))

    # TEST 5: Invalid/corrupted image
    print("\n--- Running TEST 5: Invalid / Corrupted Image ---")
    resp5 = client.post("/api/ai/validate-image", json={
        "activity": "Cycling",
        "image": "data:image/jpeg;base64,not_a_valid_base64_and_not_an_image_bytes_xyz==",
        "description": "Invalid file upload test"
    })
    print(f"Status Code: {resp5.status_code}")
    data5 = resp5.json()
    print(f"Response: {json.dumps(data5, indent=2)}")
    assert resp5.status_code == 400, f"Expected 400, got {resp5.status_code}"
    assert "detail" in data5
    results.append(("TEST 5 (Corrupted Image Handled)", "PASSED"))

    # TEST 6: Ollama server unavailable
    print("\n--- Running TEST 6: Ollama Server Unavailable Handling ---")
    original_url = settings.OLLAMA_BASE_URL
    try:
        # Point to closed port
        settings.OLLAMA_BASE_URL = "http://localhost:59999"
        resp6 = client.post("/api/ai/validate-image", json={
            "activity": "Cycling",
            "image": f"data:image/jpeg;base64,{cycling_b64}",
            "description": "Testing offline handling"
        })
        print(f"Status Code: {resp6.status_code}")
        data6 = resp6.json()
        print(f"Response: {json.dumps(data6, indent=2)}")
        assert resp6.status_code == 503, f"Expected 503, got {resp6.status_code}"
        assert "unavailable" in data6["detail"].lower() or "verify that ollama is running" in data6["detail"].lower()
        results.append(("TEST 6 (Ollama Unavailable Handled)", "PASSED"))
    finally:
        settings.OLLAMA_BASE_URL = original_url

    print("\n==================================================")
    print("TEST RESULTS SUMMARY:")
    for test_name, status in results:
        print(f"  {test_name}: {status}")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
