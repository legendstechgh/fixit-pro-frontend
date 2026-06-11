# FixIt Pro Frontend

![FixIt Pro](https://github.com/legendstechgh/fixit-pro-frontend/blob/main/public/fixIt-pro-Logo.png)

**AI-Powered Device Diagnostics & Repair Assistant**

FixIt Pro Frontend is the user-facing web application for the FixIt Pro platform. It allows users to describe device issues, receive intelligent repair guidance, and interact with the diagnostics engine through a modern, responsive interface.

Built for hackathons, rapid prototyping, and real-world troubleshooting workflows.

---

## 🚀 Features

* 🔧 Device diagnosis interface
* 🧠 AI-enhanced repair recommendations
* 📱 Mobile-friendly responsive design
* ⚡ Real-time backend connectivity testing
* 🩺 Detailed troubleshooting steps
* 📊 Confidence and severity scoring
* 💰 Repair cost estimation
* 👨‍🔧 Technician recommendation system
* 👍 User feedback collection
* 🛡️ Offline demo fallback mode

---

## 🏗️ Project Structure

```text
frontend/
│
├── public/
│   ├── fixit-pro-logo.png
│   └── fixit-pro-icon.png
│
├── app.html
├── style.css
├── loader.css
├── script.js
│
└── README.md
```

---

## 🖥️ Tech Stack

* HTML5
* CSS3
* JavaScript (ES6)
* Fetch API
* Responsive Web Design

Backend:

* Node.js
* Express.js
* JSON Knowledge Base
* Render Deployment

---

## ⚙️ Setup

### Clone Repository

```bash
git clone https://github.com/legendstechgh/fixit-pro-frontend.git
cd fixit-pro-frontend
```

### Run Locally

Using VS Code Live Server:

```bash
Right Click app.html
→ Open with Live Server
```

Or:

```bash
python -m http.server 5500
```

Then visit:

```text
http://localhost:5500
```

---

## 🔗 Backend Configuration

Inside `script.js`:

```javascript
const BACKEND_URL =
  "https://fixit-pro-backend.onrender.com";
```

For local development:

```javascript
const BACKEND_URL =
  "http://localhost:8000";
```

---

## 📸 Screenshots

### Home Interface

* Device selection
* Symptom input
* Diagnosis button

### Diagnosis Results

* Possible causes
* Repair instructions
* Cost estimate
* AI insights
* Repair success probability

---

## 🎯 How It Works

1. User selects device type
2. User describes problem
3. Frontend sends request to backend API
4. Rule-based diagnostic engine analyzes issue
5. AI enhancement layer improves recommendations
6. Results are displayed in an easy-to-follow format

---

## 🌐 API Endpoints Used

### Health Check

```http
GET /test
```

### Diagnosis

```http
POST /diagnose
```

Request:

```json
{
  "device": "phone",
  "symptom": "battery drains quickly"
}
```

### Feedback

```http
POST /feedback
```

Request:

```json
{
  "timestamp": 123456789,
  "success": true
}
```

---

## 🛡️ Demo Mode

FixIt Pro includes a built-in fallback mode for demonstrations.

If the backend becomes unavailable, the frontend automatically loads a sample diagnosis response so judges can still experience the workflow.

This ensures a smooth demo experience during hackathons and presentations.

---

## 📈 Future Improvements

* Voice-based diagnostics
* Image-based fault detection
* Predictive maintenance recommendations
* Technician marketplace integration
* Device repair history dashboard
* Multi-language support
* Mobile application

---

## 👨‍💻 Developer

**Alvin Akaba**
Founder, Legends Tech

GitHub:

[Legends Tech GitHub](https://github.com/legendstechgh?utm_source=chatgpt.com)

---

## 📄 License

MIT License

Feel free to use, modify, and improve this project.
