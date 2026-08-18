import ipaddress
import logging
import re
from datetime import datetime, timedelta

import httpx
from fastapi import Request
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.event import IpGeoCache

logger = logging.getLogger("app.geoip")

COUNTRY_HEADERS = (
    "cf-ipcountry",
    "x-vercel-ip-country",
    "cloudfront-viewer-country",
    "x-country-code",
    "x-appengine-country",
    "x-geo-country",
)

IP_HEADERS = (
    "cf-connecting-ip",
    "true-client-ip",
    "x-real-ip",
    "x-forwarded-for",
    "x-client-ip",
)

BOT_RE = re.compile(
    r"(bot|crawler|spider|crawling|preview|slurp|facebookexternalhit|facebot|"
    r"whatsapp|telegrambot|googlebot|bingbot|yandex|baiduspider|duckduckbot|"
    r"slackbot|twitterbot|applebot|semrush|ahrefs|mj12bot|dotbot|petalbot|"
    r"bytespider|gptbot|claudebot|headless|lighthouse|pingdom|uptimerobot)",
    re.I,
)

CACHE_TTL = timedelta(days=30)


def is_bot(user_agent: str) -> bool:
    return bool(BOT_RE.search(user_agent or ""))


def client_ip(request: Request) -> str:
    for header in IP_HEADERS:
        raw = request.headers.get(header)
        if not raw:
            continue
        ip = raw.split(",")[0].strip()
        if ip:
            return ip[:64]
    if request.client and request.client.host:
        return request.client.host[:64]
    return ""


def _parse_ip(ip: str):
    try:
        return ipaddress.ip_address(ip.split("%")[0])
    except ValueError:
        return None


def is_private_ip(ip: str) -> bool:
    parsed = _parse_ip(ip)
    if parsed is None:
        return True
    return bool(parsed.is_private or parsed.is_loopback or parsed.is_reserved or parsed.is_multicast)


def header_country(request: Request) -> str | None:
    for header in COUNTRY_HEADERS:
        raw = (request.headers.get(header) or "").strip().upper()
        if raw and raw not in {"XX", "T1", "ZZ", "A1", "A2", "O1"}:
            return raw[:8]
    return None


def _lookup_remote(ip: str) -> tuple[str | None, str | None]:
    try:
        res = httpx.get(
            f"http://ip-api.com/json/{ip}",
            params={"fields": "status,countryCode,city"},
            timeout=1.4,
        )
        data = res.json()
        if data.get("status") == "success":
            code = (data.get("countryCode") or "").upper() or None
            city = (data.get("city") or "")[:80] or None
            return code, city
    except Exception:
        logger.debug("ip-api lookup failed for %s", ip)

    try:
        res = httpx.get(f"https://ipwho.is/{ip}", params={"fields": "success,country_code,city"}, timeout=1.4)
        data = res.json()
        if data.get("success"):
            code = (data.get("country_code") or "").upper() or None
            city = (data.get("city") or "")[:80] or None
            return code, city
    except Exception:
        logger.debug("ipwho.is lookup failed for %s", ip)

    return None, None


def resolve_geo(request: Request, db: Session | None = None) -> dict:
    ip = client_ip(request)
    ua = (request.headers.get("user-agent") or "")[:500]
    country = header_country(request)
    city = (request.headers.get("cf-ipcity") or request.headers.get("x-vercel-ip-city") or "")[:80] or None

    if is_private_ip(ip):
        ma = bool(settings.geoip_treat_private_as_ma)
        return {
            "ip_address": ip or None,
            "ip_country": "PRIVATE" if ip else None,
            "ip_city": None,
            "is_morocco": ma,
            "user_agent": ua or None,
        }

    if not country and db is not None and ip:
        row = db.get(IpGeoCache, ip)
        if row is not None:
            stale = True
            if row.updated_at:
                age = datetime.utcnow() - row.updated_at
                stale = age > CACHE_TTL
            if not stale:
                country = (row.country or "").upper() or None
                city = city or row.city

    if not country and ip:
        country, looked_city = _lookup_remote(ip)
        city = city or looked_city
        if db is not None and ip:
            cached = db.get(IpGeoCache, ip)
            if cached is None:
                cached = IpGeoCache(ip_address=ip)
                db.add(cached)
            cached.country = country
            cached.city = city
            cached.is_morocco = country == "MA"
            try:
                db.commit()
            except Exception:
                db.rollback()

    is_ma = country == "MA"
    return {
        "ip_address": ip or None,
        "ip_country": country,
        "ip_city": city,
        "is_morocco": is_ma,
        "user_agent": ua or None,
    }
