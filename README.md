## MewCafe — Cozy Focus Timer

A cozy desktop productivity app with a Pomodoro timer, tasks, daily stats, seasonal themes, ambient sounds, and a pixel cat companion.

## what is this?

MewCafe is a relaxing desktop focus app built to make studying and deep work feel softer.  
Start a timer, add tasks, switch between cozy seasonal themes, play ambience, and track your daily focus progress.

Built with Electron, React, Vite, Framer Motion, and CSS.  
Runs as a desktop app on Windows.

## how to run it

### 1. clone the repo

```bash
git clone https://github.com/anisha-2905/Mewcafe.git
cd Mewcafe
````

### 2. install dependencies

```bash
npm install
```

### 3. run in development

```bash
npm run electron:dev
```

## how to build

To create the desktop app:

```bash
npm run dist
```

The build files will be created inside:

```bash
release/
```

## features

| feature               | what it does                                                   |
| --------------------- | -------------------------------------------------------------- |
| Pomodoro timer        | focus, pause, reset, skip sessions                             |
| Tasks                 | add, edit, complete, and delete tasks                          |
| Today stats           | tracks focus sessions, focus time, streak, and completed tasks |
| Seasonal themes       | spring, rainy, autumn, christmas                               |
| Ambient sounds        | each theme has its own background sound                        |
| Pixel cat             | cozy mascot inside the interface                               |
| Local storage         | tasks and settings stay saved                                  |
| Custom desktop window | frameless Electron window with custom title bar                |

## what makes it different

* cozy pixel-art inspired desktop UI
* seasonal animated backgrounds
* theme-based ambience
* glassmorphism cards
* custom focus hint message
* local task and timer data persistence
* no login, no backend, no internet required after setup

## tech used

* Electron
* React
* Vite
* Framer Motion
* CSS3
* LocalStorage
* Web Audio / HTML Audio

## future enhancements

* weekly productivity analytics
* custom themes
* achievement system
* better notifications
* session history dashboard
* custom ambient playlists

## developer

Created by **Anisha Salaskar**
