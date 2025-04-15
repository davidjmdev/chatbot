from flask import Flask, send_from_directory, request, Response
import requests
import os

app = Flask(__name__, static_folder="./", static_url_path="/")
RASA_URL = "http://localhost:5005"

@app.route("/")
def root():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(app.static_folder, path)

@app.route("/webhooks/rest/webhook", methods=["POST"])
def proxy_rasa():
    rasa_response = requests.post(
        f"{RASA_URL}/webhooks/rest/webhook",
        json=request.get_json(),
        headers={"Content-Type": "application/json"},
        timeout=15
    )
    return Response(rasa_response.content, status=rasa_response.status_code, content_type="application/json")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
