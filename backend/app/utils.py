"""Utilidades pequeñas replicadas del frontend (src/lib/texto.ts) para que las
respuestas del API ya vengan listas para pintar sin lógica adicional en React."""
from datetime import date, datetime, timezone


def iniciales(nombre: str) -> str:
    partes = nombre.strip().split()[:2]
    letras = "".join(p[0].upper() for p in partes if p)
    return letras or "H"


def primer_nombre(nombre: str) -> str:
    partes = nombre.strip().split()
    return partes[0] if partes else ""


def hace(momento: datetime) -> str:
    """'Hace 5 minutos', 'Ayer', 'Hace 3 días'... igual al estilo usado en data/mock.ts."""
    ahora = datetime.now(timezone.utc)
    if momento.tzinfo is None:
        momento = momento.replace(tzinfo=timezone.utc)
    delta = ahora - momento
    segundos = int(delta.total_seconds())
    if segundos < 60:
        return "Ahora"
    minutos = segundos // 60
    if minutos < 60:
        return f"Hace {minutos} minuto{'s' if minutos != 1 else ''}"
    horas = minutos // 60
    if horas < 24:
        return f"Hace {horas} hora{'s' if horas != 1 else ''}"
    dias = horas // 24
    if dias == 1:
        return "Ayer"
    if dias < 7:
        return f"Hace {dias} días"
    semanas = dias // 7
    if semanas < 4:
        return f"Hace {semanas} semana{'s' if semanas != 1 else ''}"
    meses = dias // 30
    return f"Hace {meses} mes{'es' if meses != 1 else ''}"


def edad_desde(fecha_nacimiento: date, hoy: date | None = None) -> int:
    hoy = hoy or date.today()
    cumplio_este_anio = (hoy.month, hoy.day) >= (fecha_nacimiento.month, fecha_nacimiento.day)
    return hoy.year - fecha_nacimiento.year - (0 if cumplio_este_anio else 1)
