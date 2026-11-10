from flask import Flask, request, jsonify
import boto3

app = Flask(__name__)

SNS_TOPIC_ARN = "arn:aws:sns:eu-north-1:160669537391:Foodie-Order-Notifications"

sns = boto3.client("sns", region_name="eu-north-1")


@app.route("/place-order", methods=["POST"])
def place_order():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Invalid order data"}), 400

    name = str(data.get("customer_name", "")).strip()
    email = str(data.get("email", "")).strip()
    phone = str(data.get("phone", "")).strip()
    address = str(data.get("address", "")).strip()
    items = data.get("items", [])

    if not all([name, email, phone, address]):
        return jsonify({"error": "Please provide all customer details"}), 400

    if not isinstance(items, list) or not items:
        return jsonify({"error": "Your cart is empty"}), 400

    order_lines = []
    calculated_total = 0

    for item in items:
        try:
            item_name = str(item["name"])
            price = float(item["price"])
            quantity = int(item["quantity"])

            if price < 0 or quantity < 1:
                raise ValueError()

            subtotal = price * quantity
            calculated_total += subtotal

            order_lines.append(
                f"{item_name} x {quantity} - Rs. {subtotal:.2f}"
            )

        except (KeyError, TypeError, ValueError):
            return jsonify({"error": "Invalid cart item"}), 400

    message = f"""
NEW FOODIE ORDER

Customer: {name}
Email: {email}
Phone: {phone}
Delivery Address: {address}

ORDER ITEMS:
{chr(10).join(order_lines)}

Total: Rs. {calculated_total:.2f}
"""

    try:
        sns.publish(
            TopicArn=SNS_TOPIC_ARN,
            Subject="New Foodie Order",
            Message=message
        )

        return jsonify({
            "message": "Order received successfully!"
        }), 200

    except Exception:
        app.logger.exception("SNS notification failed")
        return jsonify({
            "error": "Unable to send order notification"
        }), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)