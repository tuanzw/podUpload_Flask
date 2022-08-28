from flask import Flask, request, render_template, flash, redirect, url_for, Response
from werkzeug.utils import secure_filename

from db import db_init, db
from models import DeliverNote

app = Flask(__name__)
app.secret_key = "manbearpig_MUDMAN888"

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pod.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db_init(app)


@app.teardown_appcontext
def shutdown_session(exception=None):
    db.session.remove()
    

@app.route('/')
def index():
    flash("Select Delivery Note image")
    return render_template("index.html")

@app.route('/upload', methods=['POST'])
def upload():
    pic = request.files['pic']
    if not pic:
        return 'No pic uploaded!', 400

    filename = secure_filename(pic.filename)
    mimetype = pic.mimetype
    if not filename or not mimetype:
        return 'Bad upload!', 400

    img = DeliverNote(img=pic.read(), buff=str(request.form['buff']), name=filename, mimetype=mimetype)
    db.session.add(img)
    db.session.commit()

    flash('Img Uploaded!')
    return redirect(url_for("index"))


@app.route("/details")
def details():
    details = DeliverNote.query.all()
    return render_template("details.html", details = details)

@app.route('/details/<int:id>', methods=['GET'])
def get_img(id):
    img = DeliverNote.query.filter_by(id=id).first()
    if not img:
        return 'Img Not Found!', 404

    return Response(img.img, mimetype=img.mimetype)


@app.route('/delete/<int:id>', methods = ['GET', 'POST'])
def delete(id):
    my_data = DeliverNote.query.get(id)
    db.session.delete(my_data)
    db.session.commit()
    
    return redirect(url_for("details"))

if __name__ == "__main__":
    app.run(debug = True)