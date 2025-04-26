from flask import Flask, Response
from prometheus_client import generate_latest, Gauge
import random

app = Flask(__name__)
#randomm vals 
#non static here
#these metrics here :- 
meals_received = Gauge("meals_received", "Total number of meals received")
claims_made = Gauge("claims_made", "Total number of claims made")
avg_receive_time = Gauge("avg_receive_time_seconds", "Average time to receive meal (in seconds)")

meals_saved = Gauge("meals_saved", "Total number of meals saved")
food_donated_kg = Gauge("food_donated_kg", "Total food donated (kg)")
donations_made_week = Gauge("donations_made_week", "Donations made this week")
avg_pickup_time = Gauge("avg_pickup_time_hours", "Average pickup time in hours")

@app.route("/metrics")
def metrics():
    meals_received.set(random.randint(100, 200))
    claims_made.set(random.randint(10, 50))
    avg_receive_time.set(random.randint(800, 1500))
    meals_saved.set(random.randint(100, 250))
    food_donated_kg.set(round(random.uniform(30, 50), 2))
    donations_made_week.set(random.randint(5, 15))
    avg_pickup_time.set(round(random.uniform(0.5, 2.5), 2))
    return Response(generate_latest(), mimetype="text/plain")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8085)
