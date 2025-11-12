# 🌍 NAIMAT – Hyperlocal Food Redistribution Platform

**Members:**
1. Amna Shah  
2. Zahab Jahangir  
3. Misha Imam  
4. Muhammad Mohsin  
5. Saad Qamar  
6. Aafreen  
7. Anaksha Janki  
8. Zehra Waqar  

---

## 📖 Introduction
Food wastage is a growing challenge in urban areas, while at the same time many communities suffer from food insecurity. Restaurants, grocery stores, and households often have surplus food that could be redistributed if an efficient, scalable system existed.  

**Naimat** addresses this gap by building a **cloud-based food redistribution platform** that connects **donors** with **NGOs, volunteers, and individuals in need**.  
The system leverages **Microsoft Azure services** to provide **scalability, reliability, AI-powered features, and real-time operations**.

---

## 🎯 Objectives
- Build a scalable cloud application to connect surplus food providers with recipients.  
- Implement **real-time matching** of donors and recipients using **geolocation**.  
- Enable **AI-powered categorization** and **semantic search** to streamline food donations.  
- Provide a **transparent impact dashboard** showing food saved, meals donated, and people served.  
- Ensure **secure and seamless access** for all users: donors, NGOs, recipients, and volunteers.  

---

## ⚡ Core Features
- **Donation Posting** – Donors can upload food details, images, and availability.  
- **Pickup Coordination** – Matches donors with nearby NGOs/recipients, assigns volunteers, and optimizes pickup routes.  
- **Location-Based Matching** – Uses **Azure Maps** for proximity-based routing.  
- **Food Categorization (AI-powered)** – Auto-classifies items into cooked, packaged, or raw; generates smart tags (vegetarian, ingredients, expiry info).  
- **Semantic Search with Multilingual Support** – Enables natural language queries (English, Roman Urdu, Urdu) using embeddings + AI rephrasing.  
- **Notifications** – Real-time alerts for donors, volunteers, and recipients regarding pickup and delivery updates.  
- **Impact Dashboard** – Visual statistics on donations, waste reduction, and reach.  
- **Authentication** – Secure login for all roles (donors, NGOs, recipients, volunteers).  

---

## 🏗️ System Architecture
![Architecture Diagram](./diagram.png)

---

## ⚙️ Tech Stack
- **Frontend:** React (Vite), deployed on **Azure Static Web Apps**  
- **Backend:** NestJS (monolithic), deployed on **Azure Container Apps**  
- **AI Service:** FastAPI for food categorization + semantic search, integrated with **Azure AI Vision** and **Azure AI Search**  
- **Storage:** Azure Blob Storage, Azure Cosmos DB  
- **Other Services:**  
  - Azure Maps → Proximity-based routing  
  - Azure Functions → Event-driven tasks  
  - Azure Key Vault → Secrets management  

---
