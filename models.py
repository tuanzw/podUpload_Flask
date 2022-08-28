from datetime import datetime

from db import db


class DeliverNote(db.Model):
    __tablename__ = "dn_img"
    id = db.Column(db.Integer, primary_key=True)
    img = db.Column(db.Text, unique=True, nullable=False)
    name = db.Column(db.Text, nullable=False)
    buff = db.Column(db.Text, nullable=False)
    mimetype = db.Column(db.Text, nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    
    def __init__(self, img, buff, name, mimetype):
        super().__init__()
        self.img = img
        self.buff = buff
        self.name = name
        self.mimetype = mimetype
    
    def __repr__(self):
        return f"Delivery Note: {self.buff}"