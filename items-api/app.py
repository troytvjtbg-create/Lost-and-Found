from flask import Flask, jsonify, request
import psycopg2

app = Flask(__name__)


def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="lostfound",
        user="lostfound",
        password="lostfound123",
        port=5432
    )


@app.get("/health")
def health():
    try:
        conn = get_db_connection()
        conn.close()
        return jsonify({"status": "healthy", "database": "connected"})
    except Exception as e:
        return jsonify({"status": "unhealthy", "error": str(e)}), 500


@app.get("/items")
def get_items():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, name, type, location FROM items ORDER BY id"
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    items = []

    for row in rows:
        items.append({
            "id": row[0],
            "name": row[1],
            "type": row[2],
            "location": row[3]
        })

    return jsonify(items)


@app.post("/items")
def create_item():
    data = request.get_json()

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO items (name, type, location)
        VALUES (%s, %s, %s)
        RETURNING id, name, type, location
        """,
        (
            data["name"],
            data["type"],
            data["location"]
        )
    )

    row = cursor.fetchone()

    conn.commit()

    cursor.close()
    conn.close()

    new_item = {
        "id": row[0],
        "name": row[1],
        "type": row[2],
        "location": row[3]
    }

    return jsonify(new_item), 201


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

