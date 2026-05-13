import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AuthPage from './components/AuthPage';
import MainPage from './components/MainPage';

function AppRouter() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <MainPage /> : <AuthPage />;
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
