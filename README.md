# HELIX

HELIX is an AI-powered smart commuting ecosystem for the DEVENGERS 2.0 HACKATHON.

## Components

- Smart helmet
- Accident detection
- Emergency alert system

## Architecture

Vehicle Sensors → ESP32 / Raspberry Pi → Bluetooth / Wi-Fi / GSM → Cloud Database → Mobile App + Web Dashboard → Emergency Alerts and Analytics

## Smart Helmet

ESP32, MPU6050, chin-strap verification and GPS.

A 3.5G collision threshold triggers local audio and GPS emergency transmission.

## In-Cabin Computer Vision

OpenCV / MediaPipe, Eye Aspect Ratio (EAR), helmet presence, microsleep alerts and distraction alerts.

## Cloud and Response

Express.js + Socket.io, telemetry over WebSockets, live vehicle locations, crash alerts, Haversine algorithm and Green Corridor priority signals.

## Technology

- Hardware: ESP32, Arduino, Raspberry Pi, GPS, MPU6050, ultrasonic
- Frontend: Flutter, React, HTML, CSS, JavaScript
- Backend: Firebase, Node, Flask, Express.js, Socket.io
- AI: Python, OpenCV, TensorFlow Lite, MediaPipe
- Maps: OpenStreetMap
- Communication: Bluetooth, Wi-Fi, GSM, LoRa

## Customers

- Delivery fleets: Zomato, Swiggy, Blinkit
- Insurers
- Two-wheeler riders

## Revenue

- Hardware purchase
- Fleet subscription
- Insurance partnerships
- Government and institutional deployment

## Project Metrics

- Alert latency: <1.5s
- False-alert reduction via dual verification: 90%
- Retrofit cost: ₹5,000
- Equivalent dollar cost: approximately $60

## Privacy

- Personal data is encrypted.
- Only necessary location data is used.
- User consent is required.
- Alerts are verified.

## GitHub Pages

1. Upload the contents of this folder to a GitHub repository.
2. Open the repository settings.
3. Open Pages.
4. Select the main branch and the root folder.
5. Save the Pages configuration.
