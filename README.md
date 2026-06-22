# SEÑAS - Filipino Sign Language Learning App

SEÑAS is a mobile application developed as part of an **App Development Project**. Built with **React Native** and **Expo**, the application helps users learn **Filipino Sign Language (FSL)** through interactive lessons, practice drills, achievement tracking, and progress monitoring.

---

## 📱 Features

### 🎓 Interactive Lessons

* Learn FSL alphabets and basic signs through guided lessons.
* Structured learning path designed for beginners.

### 🧠 Practice Drills

* Practice fingerspelling and number signs.
* Flashcard-style learning experience.
* Reinforce knowledge through repetition.

### 🏆 Achievement System

* Earn badges for completing lessons.
* Unlock milestones as you progress.

### 📈 Progress Tracking

* Monitor lesson completion.
* Track performance and learning growth.

### 👤 User Profiles

* Personalized learning experience.
* View achievements and statistics.

### 🔥 Streak Tracking

* Encourage consistent learning habits.
* Track daily learning streaks.

---

## 🛠️ Tech Stack

| Technology         | Purpose                        |
| ------------------ | ------------------------------ |
| React Native       | Mobile Application Development |
| Expo               | Development Platform           |
| TypeScript         | Type-Safe Programming          |
| NativeWind         | Tailwind CSS for React Native  |
| React Navigation   | Screen Navigation              |
| @expo/vector-icons | Icons and UI Elements          |

---

## 📂 Project Structure

```text
senas_danah/
│
├── app/
│   └── App.tsx                     # Main application entry point
│
├── components/
│   ├── SplashView.tsx              # Welcome/Splash Screen
│   ├── LoginView.tsx               # User Login and Role Selection
│   ├── FamiliarityView.tsx         # Skill Level Assessment
│   ├── DashboardView.tsx           # Main Dashboard
│   ├── LessonMapView.tsx           # Lesson Path/Map
│   ├── PracticeView.tsx            # Practice Drills
│   ├── AchievementsView.tsx        # Achievement System
│   ├── ProfileView.tsx             # User Profile
│   └── LessonActiveView.tsx        # Active Lesson Player
│
├── data/
│   └── lessons.ts                  # Lesson Data and Configuration
│
├── assets/
│   └── images/
│       └── senya/                  # Senya Mascot Images
│
├── types.ts                        # TypeScript Definitions
│
└── package.json                    # Dependencies and Scripts
```

---

## 🚀 Getting Started

### Prerequisites

Before running the application, ensure that the following are installed:

* Node.js (v16 or later)
* npm or yarn
* Expo CLI
* Android Studio (Android Emulator)
* Xcode (iOS Simulator - macOS only)

---

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/senas_danah.git
cd senas_danah
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Start the Development Server

```bash
npx expo start
```

#### 4. Run the Application

**Using a Physical Device**

* Install the Expo Go application.
* Scan the generated QR code.

**Using an Emulator**

* Press `a` for Android Emulator.
* Press `i` for iOS Simulator.

---

## 🎯 Core Functionalities

### 📚 Lesson Path

* Progressive learning modules.
* Alphabet and number sign lessons.
* Interactive quizzes and assessments.
* Guided learning experience.

### ✋ Practice Mode

* Flashcards for FSL signs.
* Alphabet practice drills.
* Number sign exercises.
* Immediate feedback and reinforcement.

### 🏅 Achievement System

* Badge rewards.
* Learning milestones.
* Progress indicators.

### 👤 Profile Management

* Personal profile customization.
* Progress overview.
* Learning statistics.

---

## 📸 Screenshots

> Add screenshots after deployment or testing.

```text
screenshots/
├── splash.png
├── dashboard.png
├── lessons.png
└── practice.png
```

Example:

```md
![Splash Screen](screenshots/splash.png)

![Dashboard](screenshots/dashboard.png)

![Lessons](screenshots/lessons.png)

![Practice](screenshots/practice.png)
```

---

## 📖 Educational Purpose

This project was developed as part of the **App Development Course Requirement**.

The primary objective of SEÑAS is to promote accessibility and awareness of **Filipino Sign Language (FSL)** by providing an engaging and interactive learning platform for students and beginners.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/new-feature
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push to your branch.

```bash
git push origin feature/new-feature
```

5. Open a Pull Request.

---

## 📝 License

This project is intended for educational purposes.

```text
MIT License
```

See the `LICENSE` file for additional information.

---

## 👨‍💻 Author

### Danah Paris

**Project:** SEÑAS - Filipino Sign Language Learning App

**Course:** App Development

---

## 🙏 Acknowledgments

* Filipino Sign Language Community
* React Native Team
* Expo Team
* NativeWind Contributors
* Faculty Advisers and Project Evaluators
* All Testers and Contributors

---

<p align="center">
  Made with ❤️ for Filipino Sign Language Education
</p>
