interface CredentialResponse {
  credential: string;
  select_by: string;
}

interface GsiButtonConfiguration {
  theme: string;
  size: string;
  text: string;
  shape: string;
  width: number;
  logo_alignment: string;
}

interface IdConfiguration {
  client_id: string;
  callback: (response: CredentialResponse) => void;
}

interface Accounts {
  id: {
    initialize: (config: IdConfiguration) => void;
    renderButton: (element: HTMLElement, config: GsiButtonConfiguration) => void;
  };
}

interface Google {
  accounts: Accounts;
}

interface Window {
  google?: Google;
}
