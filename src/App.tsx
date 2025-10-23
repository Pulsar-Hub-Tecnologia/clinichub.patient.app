import '@/App.css';
import Loading from '@/components/loading/loading';
import { AuthProvider } from '@/context/auth-context';
import { LoadingProvider } from '@/context/loading-context';
import { ThemeProvider } from '@/context/theme-context';
import { AgoraProvider } from '@/context/agora-context';
import { AppRoute } from '@/routes/app.routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ModeToggle } from './components/mode-toggle/mode-toggle';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <LoadingProvider>
          <AuthProvider>
            <AgoraProvider>
              <Loading />
              <AppRoute />
              {/* <ModeToggle /> */}
            </AgoraProvider>
          </AuthProvider>
        </LoadingProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
