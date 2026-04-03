# 🏋️‍♂️ DFitness Mobile App

DFitness is a modern, cross-platform **fitness mobile application** built with **React Native (Expo Router)**. It delivers a premium workout experience through **video-based training**, **personalized programs**, and **progress tracking**.

---

## 🚀 **Features**

### 👤 Client Features

* 🎥 Video-based workouts
* 🧠 Personalized workout recommendations
* 📊 Progress tracking (weight, calories, activity)
* ❤️ Favorites & recent workouts
* 🔔 Notifications & reminders
* 🏆 Achievements & streaks

### 🧑‍💼 Admin (Future Scope)

* Upload/manage workout videos
* Create structured programs
* User analytics dashboard

---

## 🧱 **Tech Stack**

* ⚛️ React Native (Expo)
* 🧭 Expo Router (file-based navigation)
* 🎨 NativeWind (Tailwind CSS for RN)
* 🎞️ React Native Video / Expo AV
* 🗄️ Appwrite / Supabase (planned backend)
* 🔐 Authentication (JWT / OAuth)

---

## 📁 **Project Structure**

```
app/
├── index.tsx                # Splash / Entry screen (routing logic)
├── _layout.tsx              # Root layout

├── (auth)/                  # Authentication routes
│   ├── login.tsx
│   ├── register.tsx
│   ├── forgot-password.tsx
│   └── reset-password.tsx

├── (onboarding)/            # First-time user flow
│   ├── welcome.tsx
│   ├── goals.tsx
│   ├── fitness-level.tsx
│   ├── preferences.tsx
│   ├── schedule.tsx
│   └── summary.tsx

├── (tabs)/                  # Main app navigation (bottom tabs)
│   ├── home/
│   │   └── index.tsx
│   ├── workouts/
│   │   ├── index.tsx
│   │   ├── search.tsx
│   │   ├── [categoryId].tsx
│   │   ├── favorites.tsx
│   │   └── recent.tsx
│   ├── progress/
│   │   ├── index.tsx
│   │   ├── stats.tsx
│   │   ├── history.tsx
│   │   ├── weight.tsx
│   │   ├── calories.tsx
│   │   └── achievements.tsx
│   ├── profile/
│   │   ├── index.tsx
│   │   ├── edit.tsx
│   │   ├── goals.tsx
│   │   └── subscription.tsx
│   └── community/ (optional)

├── workouts/                # Workout flow (stack screens)
│   ├── [workoutId].tsx      # Workout details
│   ├── player.tsx           # Video player
│   ├── summary.tsx          # Post-workout summary
│   └── complete.tsx         # Completion screen

├── program/                 # Workout programs
│   ├── index.tsx
│   ├── [programId].tsx
│   ├── day/[dayId].tsx
│   └── progress.tsx

├── settings/                # App settings
│   ├── index.tsx
│   ├── notifications.tsx
│   ├── privacy.tsx
│   ├── account.tsx
│   └── appearance.tsx

├── modals/                  # Global modals
│   ├── workout-complete.tsx
│   ├── rest-timer.tsx
│   ├── confirm-exit.tsx
│   └── rate-workout.tsx
```

---

## 🧭 **Routing Overview**

DFitness uses **Expo Router (file-based routing)**.

### 🔑 Entry Point

* `/` → `app/index.tsx`

  * Handles:

    * Authentication check
    * Onboarding status
    * Redirect logic

---

### 🔐 Authentication Routes

```
/(auth)/login
/(auth)/register
/(auth)/forgot-password
/(auth)/reset-password
```

---

### 🚀 Onboarding Routes

```
/(onboarding)/welcome
/(onboarding)/goals
/(onboarding)/fitness-level
/(onboarding)/preferences
/(onboarding)/schedule
/(onboarding)/summary
```

---

### 📱 Main Tabs

```
/(tabs)/home
/(tabs)/workouts
/(tabs)/progress
/(tabs)/profile
```

---

### 🎥 Workout Flow

```
/workouts/[workoutId]
/workouts/player
/workouts/summary
/workouts/complete
```

---

### 📚 Programs

```
/program
/program/[programId]
/program/day/[dayId]
/program/progress
```

---

### ⚙️ Settings

```
/settings
/settings/notifications
/settings/privacy
/settings/account
/settings/appearance
```

---

### 💬 Modals

```
/modals/workout-complete
/modals/rest-timer
/modals/confirm-exit
/modals/rate-workout
```

---

## 🎨 **Themes**

DFitness supports multiple UI themes:

1. 🌑 Dark Performance Theme (default)
2. 🌕 Light Minimal Theme
3. 🌈 Energetic Gradient Theme

---

## ▶️ **Getting Started**

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npx expo start
```

### 3. Run on device

* Scan QR with Expo Go
* Or use emulator

---

## 🔐 **Environment Variables**

Create a `.env` file:

```
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_APPWRITE_ENDPOINT=
EXPO_PUBLIC_APPWRITE_PROJECT_ID=
```

---

## 🧠 **Best Practices**

* Use reusable components
* Keep screens lightweight
* Lazy load heavy screens (video player)
* Optimize video streaming
* Use global state (Zustand/Redux) for user + workouts

---

## 🚀 **Future Roadmap**

* 🤖 AI workout recommendations
* 🥗 Nutrition tracking
* ⌚ Wearables integration (Fitbit, Apple Watch)
* 💬 Coach chat system
* 💳 Subscription & payments
* 🌐 Social/community features

---

## 🏁 **License**

This project is proprietary under **Veilcode**.

---

## 👨‍💻 **Author**

Built by **Veilcode**
AI-powered digital solutions 🚀

---
