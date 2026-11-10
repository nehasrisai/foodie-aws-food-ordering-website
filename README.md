# Foodie – AWS-Based Food Ordering Website

## Project Overview

Foodie is a cloud-hosted food ordering website that allows customers to browse food items, add products to their cart, and place orders. It uses AWS services to host the website and send email notifications when an order is placed.

## Features

- Browse available food items.
- Add and remove items from the shopping cart.
- Update item quantities.
- Enter customer details during checkout.
- Submit orders through a Python Flask backend.
- Receive order notifications through email.

## Technologies Used

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Python
- Flask

**AWS Services**
- Amazon EC2 – Hosts the application.
- Amazon S3 – Stores website files.
- Amazon SNS – Sends order email notifications.
- AWS IAM – Manages permissions for EC2 to access SNS.

**Web Server**
- Nginx – Serves frontend files and forwards API requests to Flask.

## Architecture

Customer → Frontend → Nginx → Flask Backend → Amazon SNS → Email Notification

EC2 uses an IAM role to securely publish messages to the SNS topic.

## Order Processing Workflow

1. Customer selects food items and adds them to the cart.
2. Cart information is maintained using browser localStorage.
3. Customer enters their details at checkout.
4. JavaScript sends the order using a POST API request.
5. Nginx forwards the request to the Flask backend.
6. Flask processes the order and publishes a message to Amazon SNS.
7. SNS sends an email notification about the order.

## Project Structure

```text
food_ordering_website/
├── frontend/
├── backend/
│   ├── app.py
│   └── requirements.txt
├── nginx/
│   └── foodie.conf
├── screenshots/
├── .gitignore
└── README.md
```

## Backend Dependencies

Install the required Python packages using:

```bash
pip install -r requirements.txt
```

## Security

- AWS permissions are managed using an EC2 IAM role.
- No AWS access keys are hardcoded into the application.
- Private keys and sensitive files are excluded from Git using `.gitignore`.

## Future Improvements

- Integrate a database for persistent order storage.
- Add server-side menu price validation.
- Integrate a secure payment gateway.
- Configure HTTPS using an SSL certificate.

## Author

Developed as an AWS cloud and web development project.