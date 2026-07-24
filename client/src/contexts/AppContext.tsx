import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { CursorVariant } from '@/types';

interface AppState {
  isLoading: boolean;
  loadingProgress: number;
  activeSection: string;
  isMobileMenuOpen: boolean;
  cursorVariant: CursorVariant['variant'];
}

type AppAction =
  | { type: 'SET_LOADING'; payload: { isLoading: boolean; progress?: number } }
  | { type: 'SET_ACTIVE_SECTION'; payload: string }
  | { type: 'TOGGLE_MOBILE_MENU' }
  | { type: 'SET_MOBILE_MENU_OPEN'; payload: boolean }
  | { type: 'SET_CURSOR_VARIANT'; payload: CursorVariant['variant'] };

const initialState: AppState = {
  isLoading: true,
  loadingProgress: 0,
  activeSection: 'hero',
  isMobileMenuOpen: false,
  cursorVariant: 'default',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading,
        loadingProgress: action.payload.progress ?? state.loadingProgress,
      };
    case 'SET_ACTIVE_SECTION':
      return { ...state, activeSection: action.payload };
    case 'TOGGLE_MOBILE_MENU':
      return { ...state, isMobileMenuOpen: !state.isMobileMenuOpen };
    case 'SET_MOBILE_MENU_OPEN':
      return { ...state, isMobileMenuOpen: action.payload };
    case 'SET_CURSOR_VARIANT':
      return { ...state, cursorVariant: action.payload };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export default AppContext;