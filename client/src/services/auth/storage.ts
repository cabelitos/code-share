const idTokenKey = 'idToken';
const accessTokenKey = 'accessToken';

export interface TokensData {
  accessToken: string | null;
  idToken: string | null;
}

export const saveTokensToStorage = (
  accessToken: string | undefined,
  idToken: string | undefined,
): void => {
  localStorage.setItem(idTokenKey, idToken ?? '');
  localStorage.setItem(accessTokenKey, accessToken ?? '');
};

export const loadTokensFromStorage = (): TokensData => ({
  accessToken: localStorage.getItem(accessTokenKey),
  idToken: localStorage.getItem(idTokenKey),
});

export const clearStorage = (): void => {
  localStorage.clear();
};
