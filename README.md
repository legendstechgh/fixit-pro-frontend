# FixIt Pro Frontend

![FixIt Pro](https://github.com/legendstechgh/fixit-pro-frontend/blob/main/public/fixIt-pro-Logo.png)

**AI-Powered Device Diagnostics & Repair Assistant*

Intelligent Device Diagnostics & Repair Assistant
FixIt Pro Frontend is the user-facing web application for the FixIt Pro platform.
Users can describe device problems in natural language and instantly receive diagnostic insights, troubleshooting guidance, repair recommendations, severity assessments, and estimated repair costs.
Built for accessibility, rapid troubleshooting, and real-world device support.
________________________________________
Live Demo
🌐 https://fixit-pro-splunk.netlify.app
Backend API:
🌐 https://fixit-pro-backend.onrender.com
________________________________________
Features
•	🔧 Device diagnosis interface
•	🧠 Intelligent rule-based diagnostics
•	📱 Mobile-friendly responsive design
•	⚡ Backend connectivity testing
•	🩺 Step-by-step repair guidance
•	📊 Confidence scoring
•	⚠️ Severity assessment
•	💰 Repair cost estimation
•	👨‍🔧 Technician recommendation system
•	👍 User feedback collection
•	📈 Splunk observability integration
•	🎯 Real-time diagnostic reporting
________________________________________
Project Structure
.
├── app.html
├── script.js
├── style.css
├── loader.css
├── public/
│   ├── fixIt-pro-Logo.png
│   └── fixIt-pro-icon.png
│
└── README.md
________________________________________
Tech Stack
Frontend
•	HTML5
•	CSS3
•	JavaScript (ES6)
•	Fetch API
Backend
•	Node.js
•	Express.js
•	JSON Knowledge Base
Deployment
•	Netlify
•	Render
Monitoring
•	Splunk
________________________________________
Setup
Clone Repository
git clone https://github.com/legendstechgh/fixit-pro-frontend.git
cd fixit-pro-frontend
________________________________________
Run Locally
Using VS Code Live Server:
Right Click app.html
→ Open with Live Server
Or:
python -m http.server 5500
Visit:
http://localhost:5500
________________________________________
Backend Configuration
Inside script.js:
const BACKEND_URL =
  "https://fixit-pro-backend.onrender.com";
For local development:
const BACKEND_URL =
  "http://localhost:8000";
________________________________________
How It Works
1.	User selects a device type.
2.	User describes the problem.
3.	Frontend sends a request to the backend API.
4.	The diagnostic engine analyzes symptoms.
5.	The system matches known issue patterns.
6.	Repair recommendations are generated.
7.	Severity and confidence levels are calculated.
8.	Results are displayed in a structured format.
9.	Diagnostic events are logged for analytics and observability.
________________________________________
Diagnosis Output
Each diagnosis may include:
•	Diagnosis result
•	Possible causes
•	Beginner troubleshooting steps
•	Intermediate repair guidance
•	Advanced repair recommendations
•	Safety warnings
•	Severity assessment
•	Confidence score
•	Estimated repair cost
•	Technician recommendation
•	Probability of repair success
________________________________________
API Endpoints Used
Health Check
GET /test
________________________________________
Run Diagnosis
POST /diagnose
Request:
{
  "device": "phone",
  "symptom": "battery drains quickly"
}
________________________________________
Submit Feedback
POST /feedback
Request:
{
  "timestamp": 123456789,
  "success": true
}
________________________________________
Screenshots
Landing Page
•	Project overview
•	Device diagnostics introduction
•	Call-to-action section
Diagnosis Interface
•	Device selector
•	Symptom input
•	Diagnose button
Diagnostic Results
•	Diagnosis summary
•	Repair recommendations
•	Cost estimate
•	Confidence score
•	Severity level
________________________________________
Splunk Integration
FixIt Pro generates structured diagnostic events that can be monitored and analyzed through Splunk.
Captured event information includes:
•	Device type
•	Reported symptom
•	Diagnosis result
•	Severity level
•	Confidence score
•	Feedback outcome
This enables observability, trend analysis, and continuous improvement of diagnostic recommendations.
________________________________________
Use Cases
Individual Users
•	Diagnose common device issues
•	Reduce unnecessary repair expenses
•	Learn troubleshooting techniques
Technicians
•	Receive better issue descriptions
•	Improve repair efficiency
•	Standardize diagnostic workflows
Organizations
•	Analyze recurring device failures
•	Track repair trends
•	Improve maintenance planning
________________________________________
Future Improvements
•	🎙 Voice-based diagnostics
•	📷 Image-assisted fault detection
•	🤖 Machine learning recommendations
•	📱 Mobile application
•	🌍 Multi-language support
•	🛠 Technician marketplace
•	📊 Advanced analytics dashboard
________________________________________
Developer
Alvin Akaba
Founder — Legends Tech
GitHub:
https://github.com/legendstechgh
________________________________________
Hackathon Project
FixIt Pro was developed as a hackathon project focused on making device troubleshooting more accessible, affordable, and data-driven.
The platform combines intelligent diagnostics with observability principles to help users understand device problems before committing to costly repairs.
________________________________________
License
MIT License
Feel free to use, modify, and improve this project.
the workflow.

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
