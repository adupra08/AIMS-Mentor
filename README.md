# AI Mentor for Students - AIMS

A comprehensive AI-powered academic mentoring platform that helps high school students create personalized pathways to reach their dream colleges.

## Live Demo
**Try the live app here: [Open Live Demo](https://ai-student-mentor-pranavadurty1.replit.app/home) 🚀**

## Running Locally

### Prerequisites

- **Node.js** (version 18 or higher)
- **PostgreSQL** database
- **OpenAI API Key**

### Quick Setup

1. **Clone or Download the Project**
   ```bash
   git clone <your-repo-url>
   cd aims-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/aims_db

   # OpenAI API
   OPENAI_API_KEY=your_openai_api_key_here

   # Authentication (for local development)
   SESSION_SECRET=your_secret_key_here
   REPLIT_DOMAINS=localhost:5000
   REPL_ID=local_development

   # Development Environment
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Create your PostgreSQL database first, then:
   npm run db:push
   ```

5. **Start the Application**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5000`

### Alternative: Using Docker (Optional)

If you prefer using Docker:

```bash
# Build and run with docker-compose
docker-compose up --build
```

### Project Structure

```
├── client/          # React frontend
├── server/          # Express.js backend
├── shared/          # Shared schemas and types
├── dist/           # Built production files
└── package.json    # Dependencies and scripts
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Deploy database schema
- `npm run check` - Type checking

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `SESSION_SECRET` | Secret for session encryption | Yes |
| `REPLIT_DOMAINS` | Allowed domains for auth | Development |
| `REPL_ID` | Environment identifier | Development |

### Getting API Keys

1. **OpenAI API Key**: Sign up at [OpenAI Platform](https://platform.openai.com/)
2. **PostgreSQL**: Use local installation or cloud services like Neon, Supabase, or AWS RDS

### Troubleshooting

**Port Already in Use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**Database Connection Issues**
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

**OpenAI API Issues**
- Verify API key is valid
- Check API quota and billing

### Development

The app uses:
- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **AI**: OpenAI GPT-4o
- **UI**: shadcn/ui + Tailwind CSS

### Production Deployment

For production deployment, use:
```bash
npm run build
npm run start
```

Make sure to set `NODE_ENV=production` and use proper database credentials.

## 📖 Features

- AI-powered academic mentoring
- Personalized college pathway recommendations
- Opportunity matching for competitions and programs
- Progress tracking and achievements
- Real-time chat with AI mentor
- Secure authentication and user profiles

## 🔧 Tech Stack

- React.js with TypeScript
- Express.js backend
- PostgreSQL database
- OpenAI GPT-4o integration
- Drizzle ORM
- shadcn/ui components
- Tailwind CSS styling

## 📞 Support

For issues or questions, check the troubleshooting section above or refer to the project documentation.
