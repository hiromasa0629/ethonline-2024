export const BROADCASTER: any = {
  SUNWAY: "0x7fd8eae6d31628e947816a31dED60Da39b068FFE",
  MONASH: "0x51ECb56Ef64249B7a956816d102B59c90e996B35",
  TAYLORS: "0xCddB21BC982A58E808b6e594de90aEE71f4D7152",
};

// Create a client using keys returned from getKeys
const ENCODING = "binary";

export const getEnv = (): "dev" | "production" | "local" => {
  return "production";
};

export const buildLocalStorageKey = (walletAddress: string) =>
  walletAddress ? `xmtp:${getEnv()}:keys:${walletAddress}` : "";

export const loadKeys = (walletAddress: string): Uint8Array | null => {
  const val = localStorage.getItem(buildLocalStorageKey(walletAddress));
  return val ? Buffer.from(val, ENCODING) : null;
};

export const storeKeys = (walletAddress: string, keys: Uint8Array) => {
  localStorage.setItem(buildLocalStorageKey(walletAddress), Buffer.from(keys).toString(ENCODING));
};

export const wipeKeys = (walletAddress: string) => {
  // This will clear the conversation cache + the private keys
  localStorage.removeItem(buildLocalStorageKey(walletAddress));
};
