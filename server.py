from flask import Flask, render_template

app = Flask(__name__, static_url_path = '/static')

@app.route("/")
def root():
    return render_template('index.html')

if __name__ == '__main__':
    app.debug = True
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
