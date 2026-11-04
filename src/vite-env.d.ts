/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WATSONX_API_KEY?: string;
  readonly VITE_WATSONX_PROJECT_ID?: string;
  readonly VITE_WATSONX_SERVICE_URL?: string;
  readonly VITE_WATSONX_MODEL_ID?: string;
  readonly VITE_ENABLE_MOCK_FALLBACK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
