#!/usr/bin/env python3
"""
Utusu scraper (https://utusu.my.id)

Fetches the public Utusu homepage, extracts the main article body text and
downloads referenced images into a local folder. No authentication is
required for the public page.

Usage:
    python scrapers/utusu.py
    python scrapers/utusu.py --output data/utusu
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

DEFAULT_URL = "https://utusu.my.id"
DEFAULT_OUTPUT = Path("data/utusu")


def fetch_html(url: str, timeout: int = 30) -> str:
    """Download a page and return its raw HTML."""
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        ),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
    }
    response = requests.get(url, headers=headers, timeout=timeout)
    response.raise_for_status()
    response.encoding = response.apparent_encoding or "utf-8"
    return response.text


def extract_main_content(soup: BeautifulSoup) -> BeautifulSoup:
    """Return a copy of the soup containing only the main article body."""
    for selector in ("script", "style", "noscript", "svg", "path", "footer", "nav"):
        for tag in soup.select(selector):
            tag.decompose()

    main = soup.find("main") or soup.find("article") or soup.find("body") or soup
    return main


def collect_images(soup: BeautifulSoup, base_url: str) -> list[str]:
    """Return absolute image URLs referenced in the content."""
    urls: list[str] = []
    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or img.get("data-lazy-src")
        if not src:
            continue
        absolute = urljoin(base_url, src)
        if absolute.startswith(("http://", "https://")):
            urls.append(absolute)
    return urls


def download_images(urls: list[str], output_dir: Path, timeout: int = 30) -> list[dict]:
    """Download images into output_dir/images and return metadata."""
    images_dir = output_dir / "images"
    images_dir.mkdir(parents=True, exist_ok=True)

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        ),
        "Referer": DEFAULT_URL,
    }
    results: list[dict] = []
    seen: set[str] = set()

    for url in urls:
        if url in seen:
            continue
        seen.add(url)

        parsed = urlparse(url)
        name = Path(parsed.path).name or f"image-{len(results) + 1}"
        if not Path(name).suffix:
            name += ".jpg"
        name = re.sub(r"[^A-Za-z0-9_.-]", "_", name)

        dest = images_dir / name
        if dest.exists():
            results.append({"url": url, "file": str(dest), "status": "cached"})
            continue

        try:
            response = requests.get(url, headers=headers, timeout=timeout)
            response.raise_for_status()
            dest.write_bytes(response.content)
            results.append({"url": url, "file": str(dest), "status": "downloaded"})
        except Exception as exc:  # noqa: BLE001 - keep scraping resilient
            results.append({"url": url, "file": None, "status": f"error: {exc}"})

    return results


def extract_metadata(soup: BeautifulSoup) -> dict:
    """Pull title / description / headings out of the page."""
    title = soup.title.string.strip() if soup.title else ""
    description = ""
    meta_desc = soup.find("meta", attrs={"name": "description"})
    if meta_desc and meta_desc.get("content"):
        description = meta_desc["content"].strip()

    headings = [
        {"level": f"h{tag.name[1]}", "text": tag.get_text(strip=True)}
        for tag in soup.find_all(["h1", "h2", "h3"])
    ]

    return {"title": title, "description": description, "headings": headings}


def main() -> int:
    parser = argparse.ArgumentParser(description="Scrape the Utusu homepage.")
    parser.add_argument("--url", default=DEFAULT_URL, help=f"Page to scrape (default: {DEFAULT_URL})")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help=f"Output directory (default: {DEFAULT_OUTPUT})")
    parser.add_argument("--no-images", action="store_true", help="Skip downloading images")
    args = parser.parse_args()

    print(f"[utusu] Fetching {args.url} ...")
    html = fetch_html(args.url)

    soup = BeautifulSoup(html, "html.parser")
    main_content = extract_main_content(soup)

    text = main_content.get_text(separator="\n", strip=True)
    text = re.sub(r"\n{3,}", "\n\n", text)

    args.output.mkdir(parents=True, exist_ok=True)
    (args.output / "page.html").write_text(str(main_content), encoding="utf-8")
    (args.output / "page.txt").write_text(text, encoding="utf-8")

    metadata = extract_metadata(soup)
    (args.output / "metadata.json").write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    images: list[dict] = []
    if not args.no_images:
        image_urls = collect_images(soup, args.url)
        print(f"[utusu] Found {len(image_urls)} image(s), downloading ...")
        images = download_images(image_urls, args.output)
        downloaded = sum(1 for i in images if i["status"] == "downloaded")
        cached = sum(1 for i in images if i["status"] == "cached")
        print(f"[utusu] Downloaded {downloaded} new, {cached} cached, "
              f"{len(images) - downloaded - cached} failed")

    summary = {
        "url": args.url,
        "title": metadata["title"],
        "description": metadata["description"],
        "text_length": len(text),
        "headings": metadata["headings"],
        "images": images,
        "files": ["page.html", "page.txt", "metadata.json"],
    }
    (args.output / "summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print(f"[utusu] Done. Output written to {args.output.resolve()}")
    print(f"[utusu] Text preview ({len(text)} chars):")
    print(text[:600])
    return 0


if __name__ == "__main__":
    sys.exit(main())