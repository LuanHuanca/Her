"""Listas de referencia que también existen como picklists estáticas en el frontend
(frontend/src/data/mock.ts: CIUDADES, OBJETIVOS). Se validan aquí contra el mismo conjunto
para que un valor inválido no llegue nunca a la base de datos."""

CIUDADES = ["Cochabamba", "La Paz", "El Alto", "Santa Cruz", "Otra"]

OBJETIVOS_VALIDOS = {"curso", "tiempo", "finanzas", "programar", "empleo", "negocio", "red"}

MINUTOS_VALIDOS = (5, 15, 30)
HORIZONTES_VALIDOS = (3, 6, 12)
