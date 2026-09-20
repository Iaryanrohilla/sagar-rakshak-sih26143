import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
import asyncio
import httpx
from backend.main import app

async def run_all_tests():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # 1. Health
        res = await client.get("/api/v1/health")
        assert res.status_code == 200
        assert res.json()["status"] == "ONLINE"
        assert "gulf-of-kutch" in res.json()["activePilotRegions"]

        # 2. List Regions
        res = await client.get("/api/v1/regions")
        assert res.status_code == 200
        assert len(res.json()) >= 3

        # 3. Get Region
        res = await client.get("/api/v1/regions/gulf-of-kutch")
        assert res.status_code == 200
        assert res.json()["id"] == "gulf-of-kutch"
        assert len(res.json()["sensitiveZones"]) >= 3

        # 4. List Incidents
        res = await client.get("/api/v1/incidents?region_id=gulf-of-kutch")
        assert res.status_code == 200
        assert len(res.json()) >= 1
        assert res.json()[0]["id"] == "SR-KUTCH-01"

        # 5. Get Incident Detail
        res = await client.get("/api/v1/incidents/SR-KUTCH-01")
        assert res.status_code == 200
        assert res.json()["severity"] == "CRITICAL"
        assert res.json()["weathering"]["estimatedAgeHours"] == 18.4

        # 6. Detections
        res = await client.get("/api/v1/incidents/SR-KUTCH-01/detections")
        assert res.status_code == 200
        assert res.json()["lookAlikeRejection"]["algalBloom"]["status"] == "REJECTED"

        # 7. Hindcast
        res = await client.post("/api/v1/incidents/SR-KUTCH-01/drift/hindcast", json={"hours": 18.4})
        assert res.status_code == 200
        assert res.json()["simulationType"] == "HINDCAST"
        assert res.json()["originZone"]["center"] == [22.380, 69.310]

        # 8. Forecast
        res = await client.post("/api/v1/incidents/SR-KUTCH-01/drift/forecast", json={"hours": 48.0})
        assert res.status_code == 200
        assert res.json()["simulationType"] == "FORECAST"
        assert len(res.json()["landfallThreats"]) >= 2

        # 9. Vessels
        res = await client.get("/api/v1/incidents/SR-KUTCH-01/vessels")
        assert res.status_code == 200
        assert len(res.json()) >= 1
        assert res.json()[0]["mmsi"] == "354891000"

        # 10. Suspects
        res = await client.get("/api/v1/incidents/SR-KUTCH-01/suspects")
        assert res.status_code == 200
        assert res.json()[0]["rank"] == 1
        assert res.json()[0]["attributionScore"] == 89.4
        assert res.json()[0]["cpaNauticalMiles"] == 0.8

        # 11. Dispatch Alert
        res = await client.post("/api/v1/incidents/SR-KUTCH-01/alerts/dispatch", json={
            "agency": "COAST_GUARD",
            "actionType": "DISPATCH_PRT",
            "targetUnits": ["ICGS SAMUDRA PAVAK"]
        })
        assert res.status_code == 200
        assert res.json()["success"] is True

        # 12. Dossier
        res = await client.get("/api/v1/incidents/SR-KUTCH-01/dossier")
        assert res.status_code == 200
        assert len(res.json()["sha256Digest"]) == 64
        assert res.json()["accusedVessel"]["rank"] == 1
        assert len(res.json()["statutoryViolations"]) >= 2

    print("ALL 12 FASTAPI ENDPOINT TESTS PASSED CLEANLY!")

if __name__ == "__main__":
    asyncio.run(run_all_tests())
