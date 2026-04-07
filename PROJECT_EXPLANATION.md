# MedMatch: Project Overview

MedMatch (formerly Alternative Medicine Finder) is a full-stack web application designed to help users save money on their medical bills. The core premise is simple: branded medicines are often significantly more expensive than generic medicines, **even though they have the exact same active ingredients (salt composition).** 

This platform allows users to search for costly branded medicines and instantly discover cheaper, identical alternatives.

---

## 🏗️ How The Technology Works

The project is built on the **MERN Stack** (MongoDB, Express, React, Node.js) using modern practices.

### 1. The Search Flow
- When a user types in the **SearchBar**, the React frontend uses a **"debounce" mechanism**. This means it waits until the user pauses typing (for 300ms) before sending a request to the backend. This prevents overloading your database with a request for every single letter stroke. 
- The React frontend also uses an `AbortController`. If a user keeps typing, the previous obsolete network requests are aborted, avoiding "race conditions."

### 2. Finding Alternatives (The Magic)
- The core logic lives in `MedicineService.getAlternatives()`. 
- When you look at a medicine, the backend reads that medicine's `saltComposition` (e.g., `"Paracetamol 500mg"`). 
- It then queries the MongoDB database asking: *"Find me all other medicines where `saltComposition` equals 'Paracetamol 500mg', but exclude the one I'm currently looking at."*
- It sorts these results by `price` in ascending order, presenting the cheapest, most effective alternatives to the user.

### 3. State Management (Cart & Favorites)
- The Shopping Cart and Favorites features utilize browser `localStorage`. 
- To ensure the Navbar's cart badge updates instantly without needing to refresh the page, custom `window.dispatchEvent` events are fired whenever an item is added to the cart. The Navbar listens for these events and re-renders on the fly.

---

## 🌐 How to Gather Real Medicine Data

Currently, the project uses a script (`seedDatabase.js`) to generate thousands of random, fake medicines to test the UI. To make this a real business, you need real data. 

Here is how you can gather real-world medicine data:

> **Note on Legality:** Always check the Terms of Service (ToS) of websites before scraping them, as aggressive scraping can lead to IP bans or legal issues.

### 1. Web Scraping (Python / Node.js)
The most common way to get Indian/Global pharmacy data is by scraping large online pharmacies (e.g., 1mg, Apollo Pharmacy, PharmEasy, Netmeds).
- **Tools:** Use Python with `BeautifulSoup` and `Requests`, or Node.js with `Puppeteer` / `Cheerio`.
- **Target Data:** You need script bots to crawl categories and extract:
  - `Medicine Name`
  - `Manufacturer` (e.g., Cipla, Sun Pharma)
  - **`Salt Composition`** (This is the most critical field for your matching algorithm!)
  - `MRP` and `Selling Price`
  - `Image URLs`

### 2. Open APIs and Databases
Rather than scraping, you can look for public medical datasets:
- **OpenFDA:** The FDA has public APIs for drugs, though this is US-centric.
- **National Health Portals:** Some governments release excel sheets or CSVs of generic drug pricing (like the Jan Aushadhi scheme in India).
- **Third-Party Commercial APIs:** There are data aggregators you can pay a monthly fee to query their massive, pre-cleaned pharmaceutical databases.

### 3. Data Processing Pipeline (ETL)
Once you scrape the data (often into CSV or JSON files), you'll need to clean it before importing it to MongoDB:
- **Normalize Salts:** "Paracetamol 500 mg" and "Paracetamol 500mg" (with and without space) must be formatted exactly the same so your database can match them.
- **Import:** You can alter your existing `seedDatabase.js` script to read from your real CSV files and use `Medicine.insertMany()` to push the real data into your live cluster.
