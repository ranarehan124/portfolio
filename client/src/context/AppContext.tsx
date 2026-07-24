import { createContext, useContext, useReducer, type ReactNode } from 'react';

interface AppState {
  isLoading: boolean;
  loadingProgress: number;
  activeSection: string;
  isNavOpen: boolean;
  isMobileMenuOpen: boolean;
  cursorVariant: 'default' | 'hover' | 'text' | 'hidden';
  theme: 'dark';
}

type AppAction =
  | { type: 'SET_LOADING'; payload: { isLoading: boolean; progress?: number } }
  | { type: 'SET_ACTIVE_SECTION'; payload: string }
  | { type: 'TOGGLE_NAV' }
  | { type: 'SET_NAV_OPEN'; payload: boolean }
  | { type: 'TOGGLE_MOBILE_MENU' }
  | { type: 'SET_MOBILE_MENU_OPEN'; payload: boolean }
  | { type: 'SET_CURSOR_VARIANT'; payload: AppState['cursorVariant'] };

const initialState: AppState = {
  isLoading: true,
  loadingProgress: 0,
  activeSection: 'hero',
  isNavOpen: false,
  isMobileMenuOpen: false,
  cursorVariant: 'default',
  theme: 'dark',
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
    case 'TOGGLE_NAV':
      return { ...state, isNavOpen: !state.isNavOpen };
    case 'SET_NAV_OPEN':
      return { ...state, isNavOpen: action.payload };
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

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export default AppContext;