# Game On

A responsive and interactive game review web app that allows users to browse, search, and filter video games, as well as to read and submit reviews. This project is built using Next.js, Firebase, React, and Tailwind CSS.

![Game On Demo Walkthrough](https://firebasestorage.googleapis.com/v0/b/gameon-game-database.appspot.com/o/userPhotos%2Freadme%2Fgameon_demo_walkthrough.gif?alt=media&token=3011c632-f7ca-4657-a47b-99a52a29a6b1)

## Table of Contents

- [Live Demo](#live-demo)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Future Development Plans](#future-development-plans)
- [Contact](#contact)

## Live Demo

A live demo of the web app can be found [here](https://gameon-rahilbinmushfiq.vercel.app/).

## Technologies Used

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## Features

- Single-page web application built with reusable React components
- Server-side rendering and image optimization using Next.js
- Dynamic and responsive user interface using React and Tailwind CSS
- Data management using Firebase Storage and Cloud Firestore
- User authentication using Firebase Authentication
- User authorization using token ID verification with Firebase Admin SDK
- User session management using Authentication context with React Context API

## Installation

The web app is already deployed [here](https://gameon-rahilbinmushfiq.vercel.app/). If you still wish to run this project on your local machine, follow these steps:

1. Clone the repository to your local machine:

```bash
  git clone https://github.com/rahilbinmushfiq/gameon.git
```

2. Change into the project directory:

```bash
  cd gameon
```

3. Install dependencies:

```bash
  npm install
```

4. Set up Firebase:

   - Create a Firebase project and register your app. [Learn more](https://firebase.google.com/docs/web/setup#create-firebase-project-and-app)
   - generate a private key to utilize the Firebase Admin SDK. [Learn more](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments)
   - Enable Firebase Authentication with Google and email/password providers.
   - Enable a Firebase Storage and Cloud Firestore database.
   - Create a `.env.local` file in the root directory, and add your Firebase configuration keys and admin credentials:

```bash
  NEXT_PUBLIC_FIREBASE_API_KEY = your_firebase_api_key
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your_firebase_auth_domain
  NEXT_PUBLIC_FIREBASE_PROJECT_ID = your_firebase_project_id
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your_firebase_storage_bucket
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = your_firebase_messaging_sender_id
  NEXT_PUBLIC_FIREBASE_APP_ID = your_firebase_app_id
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = your_firebase_measurement_id
  FIREBASE_CLIENT_EMAIL = your_firebase_client_email
  FIREBASE_PRIVATE_KEY = your_firebase_private_key
```

5. Run the development server:

```bash
  npm run dev
```

6. Visit http://localhost:3000 in your web browser.

## Usage

Game On is a game review web app that allows users to browse and search for video game reviews. It is accessible to all users, where they can:

- Browse through the diverse range of games.
- Search for games using keywords and filters, such as platform and release date with sorting option.
- Visit a specific game page to learn more about the game:
  - Get an overview of the game, including its summary, release date, genre, and platforms, as well as its average user and critic ratings.
  - Read critic reviews submitted by experts, as well as submit your own review if you are an expert reviewer or connected to an online media company.
  - Read user reviews submitted by other users, as well as submit your own review to share your personal experience on the game.
  - Read the game's system requirements to see if your device can run this game.
- Sign in with Google or email/password, reset your password if you forget it, and sign out when you're done.
- Visit your user profile to see your information and update your profile, password, or delete your account if necessary.

## Future Development Plans

Although the app is functioning properly, I plan to make further improvements in the near future. These include:

- Allow users to edit or delete their own reviews.
- Implement the functionality to keep critic reviews on pending after submission and review the post's validity before accepting. This feature will ensure that only high-quality critic reviews are published on the site, making it a more trustworthy source of information for users.

## Contact

If you have any questions or suggestions about this project, please feel free to contact me at rahilbinmushfiq@gmail.com.
