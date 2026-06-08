"""KSA + VPN/proxy detection: MaxMind country + IPQualityScore (or ip-api fallback)."""

import logging

import httpx

from app.core.config import settings
from app.services.geoip import lookup_ip

logger = logging.getLogger(__name__)


def _lookup_ipqs(ip: str) -> dict:
    """IPQualityScore — VPN, proxy, datacenter, fraud score."""
    url = (
        f"https://ipqualityscore.com/api/json/ip/{settings.IPQUALITYSCORE_API_KEY}/{ip}"
        "?strictness=1&allow_public_access_points=false"
    )
    try:
        with httpx.Client(timeout=8.0) as client:
            resp = client.get(url)
            resp.raise_for_status()
            data = resp.json()
        if not data.get("success"):
            return {}
        return {
            "is_vpn": bool(data.get("vpn")),
            "is_proxy": bool(data.get("proxy")),
            "is_hosting": bool(data.get("hosting") or data.get("active_vpn")),
            "fraud_score": data.get("fraud_score"),
            "country_code": data.get("country_code"),
        }
    except Exception:
        logger.exception("IPQS lookup failed for %s", ip)
        return {}


def _lookup_ip_api(ip: str) -> dict:
    """Free fallback — proxy/hosting flags (non-commercial)."""
    try:
        with httpx.Client(timeout=6.0) as client:
            resp = client.get(
                f"http://ip-api.com/json/{ip}",
                params={"fields": "status,countryCode,country,proxy,hosting,mobile"},
            )
            data = resp.json()
        if data.get("status") != "success":
            return {}
        return {
            "is_vpn": False,
            "is_proxy": bool(data.get("proxy")),
            "is_hosting": bool(data.get("hosting")),
            "country_code": data.get("countryCode"),
            "country_name": data.get("country"),
        }
    except Exception:
        logger.exception("ip-api lookup failed for %s", ip)
        return {}


def analyze_ip(ip: str | None) -> dict:
    """
    Returns geo + fraud flags.
    is_valid_traffic = KSA (SA) AND NOT vpn AND NOT proxy AND NOT hosting/datacenter.
    """
    if not ip or ip in ("127.0.0.1", "::1"):
        return {
            "country_code": None,
            "country_name": None,
            "is_vpn": False,
            "is_proxy": False,
            "is_hosting": False,
            "is_valid_traffic": False,
        }

    geo = lookup_ip(ip)
    country_code = geo.get("country_code")
    country_name = geo.get("country_name")

    is_vpn = False
    is_proxy = False
    is_hosting = False

    if settings.ipqs_enabled:
        ipqs = _lookup_ipqs(ip)
        is_vpn = ipqs.get("is_vpn", False)
        is_proxy = ipqs.get("is_proxy", False)
        is_hosting = ipqs.get("is_hosting", False)
        if ipqs.get("country_code") and not country_code:
            country_code = ipqs["country_code"]
    else:
        fallback = _lookup_ip_api(ip)
        is_proxy = fallback.get("is_proxy", False)
        is_hosting = fallback.get("is_hosting", False)
        if fallback.get("country_code"):
            country_code = fallback["country_code"]
        if fallback.get("country_name"):
            country_name = fallback["country_name"]

    is_ksa = country_code == "SA"
    is_valid = is_ksa and not is_vpn and not is_proxy and not is_hosting

    return {
        "country_code": country_code,
        "country_name": country_name,
        "is_vpn": is_vpn,
        "is_proxy": is_proxy,
        "is_hosting": is_hosting,
        "is_valid_traffic": is_valid,
    }
