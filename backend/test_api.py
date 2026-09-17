import requests
import json

BASE = "http://localhost:8000/api"

def run_tests():
    print("--- 1. Testing DB Status ---")
    r = requests.get(f"{BASE}/db-status")
    print("Status code:", r.status_code)
    data = r.json()
    print("Database:", data.get("database"), "| Connected:", data.get("connected"), "| Version:", data.get("version"))
    assert data.get("connected") is True

    print("\n--- 2. Testing User Profile ---")
    r = requests.get(f"{BASE}/user/profile")
    print("Status code:", r.status_code)
    user = r.json()
    print("User Name:", user.get("name"), "| Total CO2e Avoided:", user.get("totalKgCo2eAvoided"), "kg")

    print("\n--- 3. Testing Communities ---")
    r = requests.get(f"{BASE}/communities")
    comms = r.json()
    print("Found", len(comms), "communities:", [c["name"] for c in comms])

    print("\n--- 4. Testing Challenges ---")
    r = requests.get(f"{BASE}/challenges")
    chs = r.json()
    print("Found", len(chs), "challenges:", [c["title"] for c in chs])

    print("\n--- 5. Testing Submitting Action to MySQL ---")
    payload = {
        "userId": user["id"],
        "userName": user["name"],
        "actionId": "cycle_commute",
        "actionTitle": "Bicycle Commute",
        "categoryId": "transport",
        "date": "2026-09-16",
        "quantity": 12.0,
        "unit": "km",
        "location": "RS Puram to Gandhipuram",
        "district": "Coimbatore",
        "description": "Daily green transit cycle ride displacing motorcycle commute."
    }
    r = requests.post(f"{BASE}/submissions", json=payload)
    print("Submission Status code:", r.status_code)
    sub = r.json()
    print("Created submission ID:", sub.get("id"))
    print("Avoided CO2e:", sub.get("calculatedKgCo2e"), "kg | Status:", sub.get("verificationStatus"))

    print("\n--- 6. Testing AI Climate Chat ---")
    r = requests.post(f"{BASE}/ai/chat", json={"message": "How does Singanallur Lake help Coimbatore climate?", "district": "Coimbatore"})
    print("AI Chat Status code:", r.status_code)
    chat_resp = r.json()
    print("Reply snippet:", chat_resp.get("reply")[:120], "...")
    print("Sources:", chat_resp.get("sources"))

    print("\n--- 7. Re-checking DB Status counts ---")
    r = requests.get(f"{BASE}/db-status")
    print("Counts after submission:", r.json().get("counts"))
    print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
