"""Envía las 4 plantillas de Documents/plantillas como correo de prueba vía Resend.
No imprime la API key. Uso: python scripts/send_email_previews.py
"""
from __future__ import annotations

import json
import urllib.error
import urllib.request
from pathlib import Path

ENV_PATH = Path(r"Q:\2trAIn\2trAIn-app\.env")
PLANTILLAS = Path(r"C:\Users\quiiq\Documents\plantillas")
TO = "enriquealvaroescobar@gmail.com"
OUT = Path(r"Q:\2trAIn\2trAIn-landing\scripts\send_email_previews.result.json")


def load_env(path: Path) -> dict[str, str]:
    data: dict[str, str] = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        data[k.strip()] = v.strip().strip('"').strip("'")
    return data


def send(api_key: str, frm: str, subject: str, html: str) -> dict:
    payload = json.dumps(
        {"from": frm, "to": [TO], "subject": subject, "html": html},
        ensure_ascii=False,
    ).encode("utf-8")
    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "2trAIn-email-preview/1.0",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            return {"ok": True, "status": resp.status, "body": body}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        return {"ok": False, "status": e.code, "body": body}
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "status": 0, "body": repr(e)}


def main() -> None:
    env = load_env(ENV_PATH)
    api_key = env.get("RESEND_API_KEY", "")
    email_from = env.get("EMAIL_FROM", "2trAIn <noreply@2trainapp.com>")
    if not api_key:
        raise SystemExit("RESEND_API_KEY missing")

    jobs = [
        ("waitlistes.html", "2trAIn Waitlist <waitlist@2trainapp.com>", "[PRUEBA] Waitlist ES — plaza #42"),
        ("waitlisten.html", "2trAIn Waitlist <waitlist@2trainapp.com>", "[PRUEBA] Waitlist EN — spot #42"),
        ("bienvenida.html", email_from, "[PRUEBA] Bienvenida a 2trAIn"),
        ("recuperarpassword.html", email_from, "[PRUEBA] Recuperar contraseña 2trAIn"),
    ]

    results = []
    for filename, frm, subject in jobs:
        html = (PLANTILLAS / filename).read_text(encoding="utf-8")
        result = send(api_key, frm, subject, html)
        results.append({"file": filename, "from": frm, "subject": subject, **result})
        print(f"{filename}: status={result['status']} ok={result['ok']} body={result['body'][:240]}")

    OUT.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
