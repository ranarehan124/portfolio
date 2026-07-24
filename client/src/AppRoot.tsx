import { RouterProvider } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import {
  ThemeProvider,
  SmoothScrollProvider,
  AnimationProvider,
} from '@/contexts/providers';
import { router } from '@app/router';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AnimationProvider>
          <SmoothScrollProvider>
            <RouterProvider router={router} />
          </SmoothScrollProvider>
        </AnimationProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;