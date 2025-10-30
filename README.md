# NPPD Gym Admin Frontend

Frontend application for NPPD Gym Admin built with React, TypeScript, Redux Toolkit, and Tailwind CSS.

![Application Screenshot](https://github.com/user-attachments/assets/9bf8814d-3c6b-4d57-9e9f-17b7d81e08fb)

## 🚀 Tech Stack

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management with simplified Redux
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next-generation frontend tooling
- **ESLint** - Code linting and quality checks

## 📋 Features

- ✅ React 19 with TypeScript
- ✅ Redux Toolkit for state management
- ✅ Tailwind CSS for styling
- ✅ Hot Module Replacement (HMR)
- ✅ ESLint configuration
- ✅ Type-safe Redux hooks
- ✅ Modern build system with Vite

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/CreativeC0der/NPPD_Gym_Admin_Frontend.git
cd NPPD_Gym_Admin_Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 📁 Project Structure

```
src/
├── store/
│   ├── slices/          # Redux slices
│   │   └── counterSlice.ts
│   ├── store.ts         # Redux store configuration
│   └── hooks.ts         # Typed Redux hooks
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles with Tailwind
```

## 🔧 Redux Setup

The project includes a complete Redux Toolkit setup with:

- **Store Configuration** (`src/store/store.ts`)
- **Typed Hooks** (`src/store/hooks.ts`) - Use `useAppDispatch` and `useAppSelector`
- **Example Slice** (`src/store/slices/counterSlice.ts`) - Counter example demonstrating Redux Toolkit

### Adding New Slices

1. Create a new slice in `src/store/slices/`
2. Import and add it to the store in `src/store/store.ts`
3. Use the typed hooks (`useAppDispatch`, `useAppSelector`) in your components

## 🎨 Tailwind CSS

Tailwind CSS is configured and ready to use. The configuration file is `tailwind.config.js`.

### Customizing Tailwind

Edit `tailwind.config.js` to customize your design system:

```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Add your customizations here
    },
  },
  plugins: [],
}
```

## 📝 License

See the [LICENSE](LICENSE) file for details.
