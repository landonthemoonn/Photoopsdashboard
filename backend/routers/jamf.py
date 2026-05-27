from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

router = APIRouter()


class JamfRequest(BaseModel):
    clientId: str
    clientSecret: str
    jamfUrl: str


@router.post("/api/jamf/devices")
async def get_jamf_devices(payload: JamfRequest):
    base_url = payload.jamfUrl.rstrip("/")

    # Obtain OAuth bearer token
    async with httpx.AsyncClient(timeout=30.0) as client:
        token_resp = await client.post(
            f"{base_url}/api/oauth/token",
            data={
                "grant_type": "client_credentials",
                "client_id": payload.clientId,
                "client_secret": payload.clientSecret,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

    if token_resp.status_code == 401:
        raise HTTPException(status_code=401, detail="Invalid Jamf credentials")
    if not token_resp.is_success:
        raise HTTPException(
            status_code=token_resp.status_code,
            detail=f"Jamf token request failed: {token_resp.text}",
        )

    token_data = token_resp.json()
    access_token = token_data.get("access_token")
    if not access_token:
        raise HTTPException(status_code=502, detail="No access token in Jamf response")

    headers = {"Authorization": f"Bearer {access_token}"}

    # Fetch computers — try v2 first, fall back to v1 preview on 404
    async with httpx.AsyncClient(timeout=30.0) as client:
        devices_resp = await client.get(
            f"{base_url}/api/v2/computers",
            params={"page-size": 200},
            headers=headers,
        )

        if devices_resp.status_code == 404:
            devices_resp = await client.get(
                f"{base_url}/api/v1/computers-preview",
                params={"page-size": 200},
                headers=headers,
            )

    if devices_resp.status_code == 401:
        raise HTTPException(status_code=401, detail="Jamf token rejected by device endpoint")
    if not devices_resp.is_success:
        raise HTTPException(
            status_code=devices_resp.status_code,
            detail=f"Jamf device fetch failed: {devices_resp.text}",
        )

    return devices_resp.json()
