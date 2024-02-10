import os
from flask import Flask, jsonify, render_template
import pandas as pd

app = Flask(__name__)

# Get the directory where app.py is located
base_dir = os.path.dirname(os.path.abspath(__file__))


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/index-1")
def index_1():
    return render_template("index-1.html")

@app.route("/index-1n")
def index_1n():
    return render_template("index-1n.html")

@app.route("/index-2")
def index_2():
    return render_template("index-2.html")

@app.route("/index-3")
def index_3():
    return render_template("index-3.html")

@app.route("/index-4")
def index_4():
    return render_template("index-4.html")


@app.route("/top10gamespercountry")
def api_top_10():
    csv_file = os.path.join(base_dir, "csv\\top_10_games_per_country.csv")
    df = pd.read_csv(csv_file)
    df = df.fillna("null")
    return jsonify(df.to_dict(orient="records"))


@app.route("/genrereview")
def api_genre_review_ratios():
    csv_file = os.path.join(base_dir, "csv\\genre_reviews_ratios.csv")
    df = pd.read_csv(csv_file)
    df = df.fillna("null")
    return jsonify(df.to_dict(orient="records"))


@app.route("/genre_totals")
def api_genre_totals():
    csv_file = os.path.join(base_dir, "csv\\genre_totals.csv")
    df = pd.read_csv(csv_file)
    df = df.fillna("null")
    return jsonify(df.to_dict(orient="records"))


@app.route("/ccu_ratio")
def api_ccu_ratio():
    csv_file = os.path.join(base_dir, "csv\\ccu_ratio.csv")
    df = pd.read_csv(csv_file)
    df = df.fillna("null")
    return jsonify(df.to_dict(orient="records"))


@app.route("/api/adventure")
def api_adventure():
    csv_file = os.path.join(base_dir, "csv\\adventure_data_converted.csv")
    df = pd.read_csv(csv_file)
    df = df.fillna("null")
    return jsonify(df.to_dict(orient="records"))


@app.route("/api/action")
def api_action():
    csv_file = os.path.join(base_dir, "csv\\action_data_converted.csv")
    df = pd.read_csv(csv_file)
    df = df.fillna("null")
    return jsonify(df.to_dict(orient="records"))


@app.route("/api/indie")
def api_indie():
    csv_file = os.path.join(base_dir, "csv\\indie_data_converted.csv")
    df = pd.read_csv(csv_file)
    df = df.fillna("null")
    return jsonify(df.to_dict(orient="records"))


@app.route("/api/rpg")
def rpg():
    csv_file = os.path.join(base_dir, "csv\\rpg_data_converted.csv")
    df = pd.read_csv(csv_file)
    df = df.fillna("null")
    return jsonify(df.to_dict(orient="records"))


@app.route("/api/simulation")
def api_simulation():
    csv_file = os.path.join(base_dir, "csv\\simulation_data_converted.csv")
    df = pd.read_csv(csv_file)
    df = df.fillna("null")
    return jsonify(df.to_dict(orient="records"))


@app.route("/api/sports")
def api_sports():
    csv_file = os.path.join(base_dir, "csv\\sports_data_converted.csv")
    df = pd.read_csv(csv_file)
    df = df.fillna("null")
    return jsonify(df.to_dict(orient="records"))


@app.route("/api/strategy")
def api_strategy():
    csv_file = os.path.join(base_dir, "csv\\strategy_data_converted.csv")
    df = pd.read_csv(csv_file)
    df = df.fillna("null")
    return jsonify(df.to_dict(orient="records"))


if __name__ == "__main__":
    app.run(debug=True)
