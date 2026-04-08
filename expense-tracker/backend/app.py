from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///expenses.db'
db = SQLAlchemy(app)

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float)
    category = db.Column(db.String(50))
    date = db.Column(db.String(20))
    description = db.Column(db.String(200))

@app.route('/add', methods=['POST'])
def add_expense():
    data = request.json
    expense = Expense(**data)
    db.session.add(expense)
    db.session.commit()
    return jsonify({"message": "Added"})

@app.route('/expenses', methods=['GET'])
def get_expenses():
    expenses = Expense.query.all()
    return jsonify([{
        "id": e.id,
        "amount": e.amount,
        "category": e.category,
        "date": e.date,
        "description": e.description
    } for e in expenses])

@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_expense(id):
    expense = Expense.query.get(id)
    if expense:
        db.session.delete(expense)
        db.session.commit()
        return jsonify({"message": "Deleted"})
    return jsonify({"error": "Not found"}), 404
@app.route('/update/<int:id>', methods=['PUT'])
def update_expense(id):
    data = request.json
    expense = Expense.query.get(id)

    if expense:
        expense.amount = data['amount']
        expense.category = data['category']
        expense.date = data['date']
        expense.description = data['description']
        db.session.commit()
        return jsonify({"message": "Updated"})
    
    return jsonify({"error": "Not found"}), 404
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)