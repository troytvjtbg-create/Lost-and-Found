from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import os

app = Flask(__name__)
CORS(app)


def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        database=os.getenv("DB_NAME", "lostfound"),
        user=os.getenv("DB_USER", "lostfound"),
        password=os.getenv("DB_PASSWORD", "lostfound123")
    )


@app.get("/health")
def health():
    try:
        conn = get_db_connection()
        conn.close()

        return jsonify({
            "status": "healthy",
            "database": "connected"
        }), 200

    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }), 500


@app.get("/claims")
def get_claims():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, item_id, claimant_name, contact, status
        FROM claims
        ORDER BY id
    """)

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    claims = []

    for row in rows:
        claims.append({
            "id": row[0],
            "item_id": row[1],
            "claimant_name": row[2],
            "contact": row[3],
            "status": row[4]
        })

    return jsonify(claims)


@app.post("/claims")
def create_claim():
    data = request.get_json()

    item_id = data.get("item_id")
    claimant_name = data.get("claimant_name")
    contact = data.get("contact")

    if not item_id or not claimant_name or not contact:
        return jsonify({
            "error": "item_id, claimant_name, and contact are required"
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO claims (item_id, claimant_name, contact)
        VALUES (%s, %s, %s)
        RETURNING id, item_id, claimant_name, contact, status
    """, (item_id, claimant_name, contact))

    row = cursor.fetchone()

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "id": row[0],
        "item_id": row[1],
        "claimant_name": row[2],
        "contact": row[3],
        "status": row[4]
    }), 201


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
