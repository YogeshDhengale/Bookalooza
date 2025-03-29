export {}; 

declare global {
  interface Window {
    loading?: (isLoading: boolean) => void;
    error?: (hasError: boolean) => void;
  }
}
