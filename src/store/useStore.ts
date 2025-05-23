import { create } from 'zustand';
import { Repository, FileNode, VisualizationData, VisualizationSettings } from '@/types';

interface VisualizerState {
  repository                 : Repository | null;
  isLoading                  : boolean;
  error                      : string | null;
  fileStructure              : FileNode | null;
  visualizationData          : VisualizationData | null;
  visualizationSettings      : VisualizationSettings;
  setRepository              : (repo: Repository | null) => void;
  setIsLoading               : (loading: boolean) => void;
  setError                   : (error: string | null) => void;
  setFileStructure           : (fileStructure: FileNode | null) => void;
  setVisualizationData       : (data: VisualizationData | null) => void;
  updateVisualizationSettings: (settings: Partial<VisualizationSettings>) => void;
  reset                      : () => void;
}

const defaultSettings: VisualizationSettings = {
  layout          : 'horizontal',
  theme           : 'dark',
  showDependencies: true,
  groupByFolder   : true,
  hideNodeTypes   : [],
};

const useStore = create<VisualizerState>((set) => ({
  repository           : null,
  isLoading            : false,
  error                : null,
  fileStructure        : null,
  visualizationData    : null,
  visualizationSettings: defaultSettings,
  
  setRepository       : (repository)        => set({ repository }),
  setIsLoading        : (isLoading)         => set({ isLoading }),
  setError            : (error)             => set({ error }),
  setFileStructure    : (fileStructure)     => set({ fileStructure }),
  setVisualizationData: (visualizationData) => set({ visualizationData }),
  
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
  }),
}));

export default useStore;