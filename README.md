
# MediQ Frontend
 
MediQ is a Clinical Decision Support System (CDSS) I built for clinical pharmacists, researchers, and medical professionals who need fast, evidence-backed answers from real clinical literature. Under the hood it runs a RAG (Retrieval-Augmented Generation) pipeline — so instead of getting generic AI responses, you get answers that are actually grounded in indexed pharmaceutical guidelines and documents. The frontend handles everything from starting a new chat to managing users and uploading new documents into the knowledge base.
 
---
 
## What It Can Do
 
### Clinical Chat — `/dashboard`
This is the core of the app. You type in a medical or pharmaceutical question, and the system goes through the indexed clinical documents to pull out a verified, cited answer. Responses are rendered cleanly with markdown so citations are easy to read. Past consultations are organized in a sidebar by time (Today, Earlier, etc.), and you can rename or delete any conversation. The whole chat experience is smooth — immediate loading states, auto-scroll, the works.
 
### Admin Overview — `/admin`
A high-level dashboard I built for system admins to get a quick snapshot of what's going on. It shows total indexed documents, total registered users, and how many accounts are blocked or suspended. There's also a live view of the document processing queue so you can see what's currently being parsed and ingested into the vector database.
 
### Document Management — `/admin/documents`
This is where admins upload new files into the knowledge base. I added a drag-and-drop uploader that accepts `.pdf`, `.docx`, `.doc`, and `.txt` files. Before anything gets sent, you get to preview what's in the queue with file type badges and basic validation info. Once uploaded, all documents are listed in a viewer where you can trace how they were chunked and access the original files stored on Cloudinary.
 
### User Management — `/admin/users`
A full directory of all registered users — their profile images, assigned roles, and current access status. Admins can toggle any user between **Active** and **Inactive** right from the table, which is useful for quickly suspending someone without going through a complex settings flow.
 
---
 
## Tech Stack
 
| Library / Framework | What I Used It For |
| :--- | :--- |
| **React 19** & **TypeScript** | Core app structure — typed components, clean interfaces, reactive state |
| **Vite 8** | Build tooling and dev server with instant HMR |
| **Tailwind CSS v4** | All styling, using the new `@theme` token system in `index.css` |
| **TanStack React Query v5** | Server state, caching, mutations, and query invalidation |
| **Zustand v5** | Lightweight global state for auth sessions |
| **React Router DOM v7** | Client-side routing, protected routes, and admin layouts |
| **Lucide React** | Icons throughout the UI |
| **React Dropzone** | The drag-and-drop file upload experience |
| **React Markdown** | Rendering markdown in chat responses, including citations |
| **jwt-decode** | Decoding JWT payloads on the client for role-based access |
 
---
 
## Project Structure
 
I tried to keep things modular and easy to navigate:
 
```text
mediq-frontend/
├── src/
│   ├── assets/          # Logos, SVGs, static images
│   ├── components/      # Reusable UI pieces
│   │   ├── auth/        # Login form and related components
│   │   ├── chats/       # Chat-specific components like ChatMessage
│   │   ├── layout/      # Shared wrappers — AdminLayout, Sidebar
│   │   └── ui/          # Generic controls — Button, InputField, modals
│   ├── hooks/           # Custom hooks (useAuth)
│   ├── lib/             # All API logic
│   │   ├── authapi.ts          # Base client, JWT headers, auto-logout on 401
│   │   ├── chatApi.ts      # Chat room and query submission calls
│   │   ├── dashboardApi.ts # Stats, queues, users, profiles
│   │   └── documentApi.ts  # Document list and file upload endpoints
│   ├── pages/           # Top-level route pages
│   ├── routes/          # Route definitions and role-based guards
│   ├── store/           # Zustand auth store
│   ├── types/           # Shared TypeScript types and interfaces
│   ├── App.tsx          # App root and auth initialization
│   ├── index.css        # Tailwind config and custom theme tokens
│   └── main.tsx         # DOM entry point
```
 
---
 
## Getting It Running
 
### Prerequisites
Make sure you have these installed before anything else:
- [Node.js](https://nodejs.org/) v18 or higher
- npm v9+ or Yarn
- The **MediQ backend** running at `http://localhost:5000`
### Installation
 
```bash
# Clone the repo
git clone https://github.com/bhattaraiprati/MediQ-frontend.git
cd mediq-frontend
 
# Install dependencies
npm install
```
 
### Development Server
 
```bash
npm run dev
```
 
The app will be up at `http://localhost:5173`. Keep the backend running at `http://localhost:5000` at the same time — that's what handles auth, document uploads, and the RAG queries.
 
---
 
## API Configuration

All the base API settings live in `src/lib/api.ts`:

- **Base URL:** `http://localhost:5000/api`
- **Token key:** `mediq_token`
- **User key:** `mediq_user`
Every request automatically gets the `Authorization: Bearer <token>` header attached. If the server ever returns a `401` (say, because the token expired), the app logs the user out and kicks them back to the login page automatically — no manual handling needed on the UI side.

---


## Demo & Screenshots

### Login Page
![Login page](src/assets/images/login.png)
### Chat Page
![Chat page](src/assets/images/chatpage.png)
### Chat Response Page
![Chat Response Page](src/assets/images/chat-response.png)
### Admin Dashboard Page
![Admin Dashboard Page](src/assets/images/admin-dashboard.png)
### Admin Documents uplaod Page
![Admin Documents uplaod Page](src/assets/images/admin-document.png)
### Admin Users Management Page
![Admin Users Management Page](src/assets/images/admin-users.png)

---