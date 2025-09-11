# 📝 Blogy – MERN Blogging Platform  

Blogy is a **full-stack blogging platform** built with the **MERN stack**. It allows users to create, manage, and read blog posts with secure authentication and media support.  

---

## 🚀 Features  
- ✍️ **Create & Manage Blogs** – Users can write, edit, and delete posts.  
- 🔐 **Secure Authentication** – Implemented with **JWT & Bcrypt**.  
- 📱 **Responsive UI** – Built with **React + TailwindCSS** for smooth experience on all devices.  
- ⚡ **Optimized Performance** – Faster data retrieval with **Mongoose** queries.  
- ☁️ **Media Storage** – Images and banners stored on **AWS S3**.  

---

## 🛠️ Tech Stack  
- **Frontend:** React, TailwindCSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Authentication:** JWT, Bcrypt  
- **Cloud Storage:** AWS S3  

---

 ### 1. Clone the repository  
 ```bash
git clone https://github.com/Jeetdev12/web-blog/tree/main
cd blogy
```

## 📂 Project Setup  
2. Install dependencies
npm install

3. Set up environment variables

Create a .env file in the root with:

PORT=5000
MONGO_URI=your_mongo_connection
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY=your_access_key
AWS_SECRET_KEY=your_secret_key
AWS_BUCKET_NAME=your_bucket_name

4. Run the app
# Run backend
npm run server

# Run frontend
npm run client

# Run both concurrently
npm run dev



 
