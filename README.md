# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/54da7c37-5d8b-4ede-a8f1-41a279ebbf04

## Setup Instructions

### Environment Configuration

1. **Google Reviews API Setup**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Get a Google Places API key:
     - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
     - Create a new project or select an existing one
     - Enable the "Places API (New)" 
     - Create credentials (API key)
     - Add your API key to `.env`:
       ```
       GOOGLE_API_KEY=your_actual_api_key_here
       ```
   - **Important**: The API key is used server-side only and is never exposed to frontend code

2. **Development Setup**:
   ```bash
   # Install dependencies
   npm install
   
   # Start the backend server (runs on port 5000)
   npm run start
   
   # In a new terminal, start the frontend (runs on port 8080)
   npm run dev
   ```

### Google Reviews Integration

The application includes a Google Reviews section that displays 5-star reviews for the business:

- **API Endpoint**: `GET /api/reviews`
- **Place ID**: `ChIJiQ7z-Zu8wkcRlBqQVpTgJpE` (configured for this business)
- **Language**: French reviews are prioritized
- **Rating Filter**: Only 5-star reviews are displayed
- **Component**: `GoogleReviews.tsx` fetches and displays the reviews

The reviews are automatically displayed on the main page between the Services and Contact sections.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/54da7c37-5d8b-4ede-a8f1-41a279ebbf04) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Express.js (backend)
- Google Places API

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/54da7c37-5d8b-4ede-a8f1-41a279ebbf04) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
