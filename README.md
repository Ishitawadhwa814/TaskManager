# Team Task Manager

## Features
- User authentication (login/register)
- Role-based access (Admin/Member)
- Project management
- Task tracking and status updates

## Tech Stack
- Frontend: React with React Router
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (free tier)

### 1. Clone and Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Set up MongoDB Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free account and cluster
3. Create a database user
4. Get your connection string
5. Update `server/.env` with your MongoDB URI:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/team_task_manager?retryWrites=true&w=majority
   ```

### 3. Start the Application

```bash
# Start the server (from server directory)
npm start

# In another terminal, start the client (from client directory)
npm run dev
```

The app will be running at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### 4. Connect to MongoDB Atlas

1. Open [MongoDB Atlas](https://cloud.mongodb.com) and sign in.
2. Create a free cluster.
3. Create a database user and password under "Database Access".
4. Add your IP address under "Network Access".
5. Get the connection string from "Connect" → "Connect your application".
6. Replace the placeholder in `server/.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/team_task_manager?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

7. Restart the backend server.

### 5. Deploy to Railway

1. Create a Railway account at https://railway.app.
2. Create a new project and connect your GitHub repo if you have one.
3. Add environment variables in Railway:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT` (optional)
4. Set the deployment command for the server:
   - `npm install && npm start`
5. Set the build command for the client if deploying separately:
   - `npm install && npm run build`
6. Expose the backend port and deploy the frontend as a static site or as a separate Railway service.

### Usage
1. Register a new account or login.
2. Admins can create projects.
3. All users can create tasks and update status.
4. Tasks can be assigned to projects and users.

### Notes for MongoDB Connection
- Use your Atlas username and password in `server/.env`.
- If your cluster is not named `cluster0`, replace the host in the URI.
- Keep `JWT_SECRET` secret and do not share it publicly.

### Example `server/.env`

```env
MONGO_URI=mongodb+srv://myUser:myPassword@cluster0.mongodb.net/team_task_manager?retryWrites=true&w=majority
JWT_SECRET=supersecretjwtkey
PORT=5000
```
cd client
npm install

## Run Backend
npm run dev

## Run Frontend
npm start
