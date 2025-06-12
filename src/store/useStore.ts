import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Repository, FileNode, VisualizationData, VisualizationSettings } from '@/types';

interface VisualizerState {
  isOpenModal                : boolean,
  repository                 : Repository | null;
  isLoading                  : boolean;
  error                      : string | null;
  fileStructure              : FileNode | null;
  visualizationData          : VisualizationData | null;
  visualizationSettings      : VisualizationSettings;
  theme                      : 'light' | 'dark';
  toggleTheme                : () => void;
  setRepository              : (repo: Repository | null) => void;
  setIsLoading               : (loading: boolean) => void;
  setError                   : (error: string | null) => void;
  setFileStructure           : (fileStructure: FileNode | null) => void;
  setVisualizationData       : (data: VisualizationData | null) => void;
  updateVisualizationSettings: (settings: Partial<VisualizationSettings>) => void;
  reset                      : () => void;
  setIsOpenModal             : (value: boolean) => void;
}

const defaultSettings: VisualizationSettings = {
  layout          : 'horizontal',
  theme           : 'dark',
  showDependencies: true,
  groupByFolder   : true,
  hideNodeTypes   : [],
};

const useStore = create<VisualizerState>()(
  persist(
    (set) => ({
      isOpenModal          : false,
      repository           : null,
      isLoading            : false,
      error                : null,
      fileStructure        : null,
      visualizationData    : null,
      visualizationSettings: defaultSettings,
      theme                : 'light',
      
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        if (newTheme === 'dark') {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
        return { theme: newTheme };
      }),
      
      setRepository       : (repository)        => set({ repository }),
      setIsLoading        : (isLoading)         => set({ isLoading }),
      setError            : (error)             => set({ error }),
      setFileStructure    : (fileStructure)     => set({ fileStructure }),
      setVisualizationData: (visualizationData) => set({ visualizationData }),
      setIsOpenModal      : (value: boolean)    => set({ isOpenModal: value }),

      updateVisualizationSettings: (partialSettings) =>
        set((state) => ({
          visualizationSettings: { ...state.visualizationSettings, ...partialSettings }
        })),
      
      reset: () => set({
        repository           : null,
        isLoading            : false,
        error                : null,
        fileStructure        : null,
        visualizationData    : null,
        visualizationSettings: defaultSettings,
        theme                : 'light',
      }),
    }),
    {
      name: 'visualizer-storage',
      partialize: (state) => ({ 
        visualizationSettings: state.visualizationSettings,
        theme: state.theme 
      }),
    }
  )
);

export default useStore;