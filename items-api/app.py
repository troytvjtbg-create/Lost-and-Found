from flask import Flask, jsonify, request

app = Flask(__name__)

items = [
    {
        "id": 1,
        "name": "Black Wallet",
        "type": "lost",
        "location": "Library"
    },
    {
        "id": 2,
        "name": "Blue Umbrella",
        "type": "found",
        "location": "Cafeteria"
    }
]


@app.get("/health")
def health():
    return jsonify({"status": "healthy"})


@app.get("/items")
def get_items():
    return jsonify(items)


@app.post("/items")
def create_item():
    data = request.get_json()

    new_item = {
        "id": len(items) + 1,
        "name": data["name"],
        "type": data["type"],
        "location": data["location"]
    }

    items.append(new_item)

    return jsonify(new_item), 201


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

