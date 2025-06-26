export {};

declare global {
  interface Window {
    googleOneTapScriptLoaded?: boolean;
    google: GoogleWithMapsAndAccounts;
  }

  interface GoogleWithMapsAndAccounts {
    maps?: {
      __ib__(): void; // 保留 maps 需要的型別
    };
    accounts?: {
      id: {
        initialize: (config: {
          client_id: string;
          callback: (response: {credential: string}) => void;
          auto_select?: boolean;
          cancel_on_tap_outside?: boolean;
        }) => void;
        prompt: () => void;
      };
    };
  }
}
