# HomeHave

List homes, upload images, and manage listings with a simple UI.

**Live site:** https://homehave-website.onrender.com/

---

## Table of contents
- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Key routes](#key-routes)
- [Image uploads](#image-uploads)
- [Deploying to Render](#deploying-to-render)
- [Troubleshooting](#troubleshooting)

---

## Features
- Add, edit, and delete homes
- Upload multiple images to Cloudinary
- Replace images on edit (keeps existing images if none are uploaded)
- Server-side views with EJS
- Sessions stored in MongoDB
- Tailwind CSS styling

## Tech stack
- **Backend:** Node.js 20, Express, express-session, connect-mongodb-session  
- **Views:** EJS  
- **Database:** MongoDB (Mongoose)  
- **Uploads:** Multer + Cloudinary  
- **Styles:** Tailwind CLI
