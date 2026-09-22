"""Seed inicial de la base de datos. Idempotente: si ya hay usuarios, no hace nada.

Contenido de los módulos: el día 7 de "Amor propio" es el único que ya estaba diseñado
en el prototipo (frontend/src/data/mock.ts) y se preserva tal cual. Los otros 125 días
(6 módulos x 21 días) se generan con una plantilla por módulo, rotando un puñado de
consignas — contenido de partida razonable, pensado para que el equipo de contenido lo
reemplace más adelante por las 126 lecciones reales.

Se ejecuta automáticamente al levantar el contenedor backend (ver entrypoint.sh).
"""
from datetime import date, datetime, timedelta, timezone

from app.db import SessionLocal
from app.enums import BuscaEmpleo, EmpleoModalidad, EventoModalidad, FotoEscena, Jornada, PreferenciaEventos, Rol, TipoChat, Tono
from app.models import (
    Chat,
    ChatParticipante,
    Comentario,
    Empleo,
    Empresa,
    Evento,
    Like,
    Meta,
    Mensaje,
    Modulo,
    ProgresoReto,
    Publicacion,
    TareaModulo,
    Usuario,
)
from app.security import hash_password

PASSWORD_DEMO = "Her12345"
PASSWORD_ADMIN = "Admin12345"

MODULOS = [
    {"id": "amor-propio", "numero": 1, "titulo": "Amor propio y autoconfianza", "corto": "Amor propio", "descripcion": "Conócete, valórate y habla bien de ti"},
    {"id": "mentalidad", "numero": 2, "titulo": "Mentalidad", "corto": "Mentalidad", "descripcion": "Hábitos y creencias que te impulsan"},
    {"id": "finanzas", "numero": 3, "titulo": "Finanzas personales", "corto": "Finanzas", "descripcion": "Presupuesto, ahorro y metas"},
    {"id": "organizacion", "numero": 4, "titulo": "Organización y equilibrio", "corto": "Organización", "descripcion": "Tiempo, roles y responsabilidades"},
    {"id": "liderazgo", "numero": 5, "titulo": "Liderazgo", "corto": "Liderazgo", "descripcion": "Comunicación y toma de decisiones"},
    {"id": "habilidades", "numero": 6, "titulo": "Habilidades para el trabajo", "corto": "Habilidades", "descripcion": "Herramientas digitales, CV y entrevistas"},
]

# Consignas semilla por módulo (se ciclan a lo largo de los 21 días).
CONSIGNAS = {
    "amor-propio": [
        "Escribe 3 cosas que admiras de ti misma",
        "Anota un logro reciente, por pequeño que parezca",
        "Escribe una frase que te gustaría escuchar más seguido",
        "Describe un momento en el que te sentiste orgullosa de ti",
        "Nombra una cualidad tuya que ayuda a tus hijas o hijos",
    ],
    "mentalidad": [
        "Escribe un pensamiento negativo recurrente y su versión más justa",
        "Anota un hábito pequeño que quieres empezar esta semana",
        "Describe cómo reaccionaste hoy ante un contratiempo",
        "Escribe algo que aprendiste de un error reciente",
        "Nombra una creencia que te gustaría cambiar",
    ],
    "finanzas": [
        "Anota tus 3 gastos más grandes de la semana",
        "Escribe una meta de ahorro para este mes",
        "Registra un gasto que podrías reducir",
        "Describe cómo te sentiste al revisar tus cuentas hoy",
        "Anota un ingreso extra que podrías generar",
    ],
    "organizacion": [
        "Escribe las 3 tareas más importantes de mañana",
        "Anota una actividad que puedes delegar o simplificar",
        "Describe cómo repartiste tu tiempo hoy",
        "Escribe un límite que necesitas poner esta semana",
        "Nombra un espacio de tu día que es solo tuyo",
    ],
    "liderazgo": [
        "Describe una conversación difícil que manejaste bien",
        "Escribe una decisión que tomaste hoy y por qué",
        "Anota algo que te gustaría comunicar mejor",
        "Describe a alguien que admiras por cómo lidera",
        "Escribe un consejo que le darías a otra mamá",
    ],
    "habilidades": [
        "Anota una habilidad que quieres reforzar en tu CV",
        "Escribe 2 logros laborales o de estudio recientes",
        "Describe cómo te preparas para una entrevista",
        "Anota una herramienta digital que aprendiste a usar",
        "Escribe qué te gustaría que supieran de ti en una entrevista",
    ],
}

TAREA_DIA7_AMOR_PROPIO = {
    "titulo": "¿Quién soy realmente?",
    "frase": "No puedes amarte si no te conoces primero",
    "texto": [
        "Conocerte a ti misma es el primer paso para transformarte. Cuando te tomas el tiempo de mirar hacia adentro, descubres quién eres, qué amas, qué te motiva y qué te hace única.",
        "Saber quién eres te da claridad para tomar mejores decisiones, poner límites cuando hace falta y vivir desde tu autenticidad.",
    ],
    "consigna": "Escribe 3 cosas que admiras de ti misma",
}


def _tareas_modulo(modulo_id: str, titulo_modulo: str) -> list[dict]:
    consignas = CONSIGNAS[modulo_id]
    tareas = []
    for dia in range(1, 22):
        if modulo_id == "amor-propio" and dia == 7:
            tareas.append({"dia": dia, **TAREA_DIA7_AMOR_PROPIO, "duracion_seg": 300, "minutos": 10, "puntos": 50})
            continue
        consigna = consignas[(dia - 1) % len(consignas)]
        tareas.append(
            {
                "dia": dia,
                "titulo": f"{titulo_modulo} · día {dia}",
                "frase": "Un paso pequeño hoy, un cambio grande con el tiempo",
                "texto": [
                    f"Hoy seguimos avanzando en {titulo_modulo.lower()}. Dedica unos minutos a leer con calma y a pensar en tu propia experiencia.",
                    "No hace falta que sea perfecto: lo importante es la constancia de volver, día a día, a este espacio para ti.",
                ],
                "consigna": consigna,
                "duracion_seg": 300,
                "minutos": 10,
                "puntos": 50,
            }
        )
    return tareas


PERSONAS_DEMO = {
    "admin": {"email": "admin@her.app", "nombre": "Admin Her", "tono": Tono.cielo, "ciudad": "Cochabamba", "ocupacion": "Administración", "hijos": 0},
    "litzy": {"email": "litzy@her.app", "nombre": "Litzy Tapia", "tono": Tono.rosa, "ciudad": "Cochabamba", "ocupacion": "Ingeniera de sistemas", "hijos": 2},
    "diana": {"email": "diana@her.app", "nombre": "Diana Romero", "tono": Tono.rosa, "ciudad": "Cochabamba", "ocupacion": "Emprendedora", "hijos": 1},
    "lucero": {"email": "lucero@her.app", "nombre": "Lucero Quiroz", "tono": Tono.lavanda, "ciudad": "Santa Cruz", "ocupacion": "Desarrolladora web", "hijos": 1},
    "andrea": {"email": "andrea@her.app", "nombre": "Andrea Sánchez", "tono": Tono.salvia, "ciudad": "La Paz", "ocupacion": "Consultora", "hijos": 2},
    "jessica": {"email": "jessica@her.app", "nombre": "Jessica Pérez", "tono": Tono.durazno, "ciudad": "El Alto", "ocupacion": "Asistente administrativa", "hijos": 3},
    "cristina": {"email": "cristina@her.app", "nombre": "Cristina Montaño", "tono": Tono.cielo, "ciudad": "La Paz", "ocupacion": "Estudiante", "hijos": 1},
    "juliana": {"email": "juliana@her.app", "nombre": "Juliana Portillo", "tono": Tono.rosa, "ciudad": "Cochabamba", "ocupacion": "Diseñadora", "hijos": 2},
}

EMPRESAS = [
    {"nombre": "Pata Pila", "iniciales": "PP", "tono": Tono.durazno},
    {"nombre": "Estudio Andino", "iniciales": "EA", "tono": Tono.salvia},
    {"nombre": "Tienda Awayo", "iniciales": "TA", "tono": Tono.rosa},
    {"nombre": "Contadores Illimani", "iniciales": "CI", "tono": Tono.cielo},
    {"nombre": "Nube Sur", "iniciales": "NS", "tono": Tono.lavanda},
]

EVENTOS = [
    {"titulo": "Glow Up: mamás que emprenden", "offset": 2, "hora": "19:00", "duracion": 45, "modalidad": EventoModalidad.virtual, "lugar": "Zoom", "descripcion": "Dos mamás emprendedoras comparten cómo equilibran su negocio y su familia."},
    {"titulo": "Mujeres de éxito", "offset": 5, "hora": "19:30", "duracion": 45, "modalidad": EventoModalidad.virtual, "lugar": "Google Meet", "descripcion": "Historias reales de liderazgo contadas por sus protagonistas."},
    {"titulo": "Mejora tu LinkedIn", "offset": 9, "hora": "10:00", "duracion": 45, "modalidad": EventoModalidad.virtual, "lugar": "Zoom", "descripcion": "Arma, paso a paso, un perfil que atraiga oportunidades."},
    {"titulo": "Encuentro de mamás", "offset": 16, "hora": "16:00", "duracion": 90, "modalidad": EventoModalidad.presencial, "lugar": "Cochabamba", "descripcion": "Un espacio para conocernos, compartir avances y hacer red."},
    {"titulo": "Finanzas para el hogar", "offset": 23, "hora": "10:00", "duracion": 60, "modalidad": EventoModalidad.presencial, "lugar": "La Paz", "descripcion": "Taller práctico de presupuesto familiar y ahorro."},
]


def run() -> None:
    db = SessionLocal()
    try:
        if db.query(Usuario).first() is not None:
            print("[seed] Ya hay datos, no se vuelve a sembrar.")
            return

        print("[seed] Sembrando módulos y tareas...")
        for m in MODULOS:
            modulo = Modulo(**m)
            db.add(modulo)
            for t in _tareas_modulo(m["id"], m["titulo"]):
                db.add(TareaModulo(modulo_id=m["id"], **t))
        db.flush()

        print("[seed] Sembrando usuarias demo...")
        usuarios: dict[str, Usuario] = {}
        for clave, datos in PERSONAS_DEMO.items():
            usuario = Usuario(
                email=datos["email"],
                password_hash=hash_password(PASSWORD_ADMIN if clave == "admin" else PASSWORD_DEMO),
                nombre=datos["nombre"],
                fecha_nacimiento=date(1996, 5, 17) if clave == "litzy" else date(1993, 3, 10),
                ciudad=datos["ciudad"],
                ocupacion=datos["ocupacion"],
                hijos=datos["hijos"],
                busca_empleo=BuscaEmpleo.si,
                eventos=PreferenciaEventos.ambos,
                tono=datos["tono"],
                rol=Rol.admin if clave == "admin" else Rol.usuaria,
            )
            db.add(usuario)
            usuarios[clave] = usuario
        db.flush()

        print("[seed] Sembrando metas y progreso...")
        for clave, usuario in usuarios.items():
            if clave == "litzy":
                db.add(Meta(usuario_id=usuario.id, objetivos=["empleo", "tiempo"], minutos_al_dia=15, horizonte_meses=6))
                db.add(ProgresoReto(usuario_id=usuario.id, modulo_id="amor-propio", dia_actual=7, racha=6, completado_hoy=False, puntos=8918))
            elif clave == "diana":
                db.add(Meta(usuario_id=usuario.id, objetivos=["negocio", "finanzas"], minutos_al_dia=15, horizonte_meses=12))
                db.add(ProgresoReto(usuario_id=usuario.id, modulo_id="amor-propio", dia_actual=21, racha=21, completado_hoy=True, puntos=15230))
            else:
                db.add(Meta(usuario_id=usuario.id, objetivos=["tiempo"], minutos_al_dia=5, horizonte_meses=3))
                db.add(ProgresoReto(usuario_id=usuario.id, modulo_id="amor-propio", dia_actual=1, racha=0, completado_hoy=False, puntos=0))
        db.flush()

        print("[seed] Sembrando empresas y empleos...")
        empresas = {}
        for e in EMPRESAS:
            empresa = Empresa(**e)
            db.add(empresa)
            empresas[e["nombre"]] = empresa
        db.flush()

        empleos_data = [
            {"id": "ejecutiva-ventas", "puesto": "Ejecutiva de ventas", "empresa": "Pata Pila", "ciudad": "Cochabamba", "jornada": Jornada.tiempo_completo, "modalidad": EmpleoModalidad.presencial, "publica": "lucero", "descripcion": "Buscamos a alguien con ganas de crecer, buena comunicación y orientación a metas para atender clientes y cerrar ventas.", "requisitos": ["Buena comunicación oral", "Organización del tiempo", "Experiencia en atención al cliente (deseable)"], "coincidencias": ["Comunicación", "Organización del tiempo", "Atención al cliente"]},
            {"id": "consultora-junior", "puesto": "Consultora junior", "empresa": "Estudio Andino", "ciudad": "La Paz", "jornada": Jornada.medio_tiempo, "modalidad": EmpleoModalidad.remoto, "publica": "andrea", "descripcion": "Apoyo en la elaboración de informes y seguimiento a clientes, con horario flexible de 4 horas diarias.", "requisitos": ["Excel básico", "Redacción clara", "Disponibilidad de 4 horas diarias"], "coincidencias": ["Excel básico", "Redacción"]},
            {"id": "encargada-tienda", "puesto": "Encargada de tienda", "empresa": "Tienda Awayo", "ciudad": "Cochabamba", "jornada": Jornada.medio_tiempo, "modalidad": EmpleoModalidad.presencial, "publica": "diana", "descripcion": "Atención al público, control de inventario y cierre de caja en turno de mañana.", "requisitos": ["Manejo de caja", "Atención al cliente", "Turno de mañana"], "coincidencias": ["Atención al cliente"]},
            {"id": "asistente-administrativa", "puesto": "Asistente administrativa", "empresa": "Contadores Illimani", "ciudad": "El Alto", "jornada": Jornada.medio_tiempo, "modalidad": EmpleoModalidad.hibrido, "publica": "jessica", "descripcion": "Gestión de documentos, agenda y archivo digital. Dos días presenciales por semana.", "requisitos": ["Office básico", "Orden y puntualidad", "Bachillerato concluido"], "coincidencias": ["Organización del tiempo", "Office básico"]},
            {"id": "desarrolladora-web", "puesto": "Desarrolladora web junior", "empresa": "Nube Sur", "ciudad": "Santa Cruz", "jornada": Jornada.tiempo_completo, "modalidad": EmpleoModalidad.remoto, "publica": "lucero", "descripcion": "Maquetación de sitios y mantenimiento de páginas para clientes pequeños. Incluye mentoría semanal.", "requisitos": ["HTML y CSS", "Ganas de aprender JavaScript", "Portafolio (aunque sea pequeño)"], "coincidencias": ["Ganas de aprender"]},
        ]
        for e in empleos_data:
            db.add(
                Empleo(
                    id=e["id"], puesto=e["puesto"], empresa_id=empresas[e["empresa"]].id, ciudad=e["ciudad"],
                    jornada=e["jornada"], modalidad=e["modalidad"], publicado_por_id=usuarios[e["publica"]].id,
                    descripcion=e["descripcion"], requisitos=e["requisitos"], coincidencias=e["coincidencias"],
                )
            )

        print("[seed] Sembrando eventos...")
        hoy = date.today()
        for e in EVENTOS:
            db.add(
                Evento(
                    titulo=e["titulo"], fecha=hoy + timedelta(days=e["offset"]), hora=e["hora"],
                    duracion_min=e["duracion"], modalidad=e["modalidad"], lugar=e["lugar"], descripcion=e["descripcion"],
                )
            )

        print("[seed] Sembrando publicaciones y comentarios...")
        p1 = Publicacion(autor_id=usuarios["diana"].id, etiqueta="Día 5", texto="Estoy muy feliz de decidir hacer ejercicio hoy a pesar de estar muy ocupada. ¡El reto me está ayudando a darme un espacio!", foto_descripcion="Zapatillas rosadas, botella de agua y cuerda para saltar", foto_escena=FotoEscena.actividad)
        p2 = Publicacion(autor_id=usuarios["lucero"].id, etiqueta="Evento", texto="La última reunión me inspiró a tomar este nuevo curso. ¡Gracias a las mentoras por compartir sus historias!", foto_descripcion="Mujer estudiando frente a su laptop", foto_escena=FotoEscena.estudio)
        p3 = Publicacion(autor_id=usuarios["jessica"].id, etiqueta="Finanzas", texto="Hoy armé mi primer presupuesto semanal con la plantilla del módulo. Pequeños pasos, grandes cambios.")
        db.add_all([p1, p2, p3])
        db.flush()

        db.add(Comentario(publicacion_id=p1.id, autor_id=usuarios["andrea"].id, texto="¡Qué bien, Diana! Ese espacio para ti vale oro."))
        db.add(Comentario(publicacion_id=p2.id, autor_id=usuarios["cristina"].id, texto="Felicidades, ¿me pasas el enlace? Me interesa."))
        db.add(Comentario(publicacion_id=p2.id, autor_id=usuarios["jessica"].id, texto="¡Vamos, Lucero! Cuéntanos cómo te va."))

        for autora, publicacion in [("lucero", p1), ("andrea", p1), ("jessica", p1), ("diana", p2), ("cristina", p2), ("litzy", p2), ("andrea", p3), ("juliana", p3)]:
            db.add(Like(usuario_id=usuarios[autora].id, publicacion_id=publicacion.id))

        print("[seed] Sembrando chats...")
        chats_data = [
            {"otro": "jessica", "tipo": TipoChat.amiga, "texto": "Espero que estés bien", "no_leidos": 1},
            {"otro": "diana", "tipo": TipoChat.amiga, "texto": "Nos vemos en la reunión", "no_leidos": 0},
            {"otro": "lucero", "tipo": TipoChat.amiga, "texto": "Tu historia me inspiró", "no_leidos": 0},
            {"otro": "andrea", "tipo": TipoChat.mentora, "texto": "¿Ya hiciste tu reto de hoy?", "no_leidos": 2},
            {"grupo": "Mamás emprendedoras", "tipo": TipoChat.grupo, "texto": "Andrea: ¿Quién va al encuentro del sábado?", "no_leidos": 3},
            {"otro": "cristina", "tipo": TipoChat.amiga, "texto": "¡Hola!", "no_leidos": 0},
            {"otro": "juliana", "tipo": TipoChat.amiga, "texto": "¡Me encanta!", "no_leidos": 0},
        ]
        for i, c in enumerate(chats_data):
            if "grupo" in c:
                chat = Chat(tipo=c["tipo"], otro_nombre=c["grupo"], otro_iniciales="ME", otro_tono=Tono.salvia)
            else:
                otro = usuarios[c["otro"]]
                chat = Chat(tipo=c["tipo"], otro_nombre=otro.nombre, otro_iniciales="".join(p[0].upper() for p in otro.nombre.split()[:2]), otro_tono=otro.tono)
            db.add(chat)
            db.flush()
            db.add(ChatParticipante(chat_id=chat.id, usuario_id=usuarios["litzy"].id, no_leidos=c["no_leidos"]))
            db.add(Mensaje(chat_id=chat.id, texto=c["texto"], creado_en=datetime.now(timezone.utc) - timedelta(minutes=(i + 1) * 5)))

        db.commit()
        print("[seed] Listo.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
