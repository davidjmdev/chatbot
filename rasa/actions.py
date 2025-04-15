# ... (tu código de actions aquí)

# --- Handler para evitar error HEAD en Render ---
try:
    from sanic import Sanic
    from sanic.response import text
    app = Sanic.get_app("rasa_sdk.endpoint")
    if app:
        @app.route("/", methods=["HEAD"])
        async def healthcheck(request):
            return text("OK", status=200)
except Exception:
    pass  # Si no está Sanic o el contexto no es el esperado, ignora
