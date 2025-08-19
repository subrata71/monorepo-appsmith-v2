import { create } from 'zustand';

interface NavigationState {
  isNavigating: boolean;
  startNavigation: () => void;
  completeNavigation: () => void;
}

export const useNavigationStore = create<NavigationState>(set => ({
  isNavigating: false,
  startNavigation: () => set({ isNavigating: true }),
  completeNavigation: () => set({ isNavigating: false }),
}));
