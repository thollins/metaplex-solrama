import React, {
  createContext,
  FC,
  useState,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { getStoreID, setProgramIds, StringPublicKey } from '../utils';
import { useQuerySearch } from '../hooks';

interface StoreConfig {
  // Store Address
  storeAddress?: StringPublicKey;
  // Store was configured via ENV or query params
  isConfigured: boolean;
  // Initial calculating of store address completed (successfully or not)
  isReady: boolean;
  // recalculate store address for specified owner address
  setStoreForOwner: (ownerAddress?: string) => Promise<string | undefined>;
  // solrama.io cost to mint
  solramaCostToMint?: number;
}

export const StoreContext = createContext<StoreConfig>(null!);

export const StoreProvider: FC<{
  ownerAddress?: string;
  storeAddress?: string;
  solramaCostToMint?: number;
}> = ({ children, ownerAddress, storeAddress, solramaCostToMint }) => {
  const searchParams = useQuerySearch();
  const ownerAddressFromQuery = searchParams.get('store');

  const initOwnerAddress = ownerAddressFromQuery || ownerAddress;
  const initStoreAddress = !ownerAddressFromQuery ? storeAddress : undefined;
  const initSolramaCostToMint = !solramaCostToMint ? 0.01 : solramaCostToMint;
  const isConfigured = Boolean(initStoreAddress || initOwnerAddress);

  const [store, setStore] = useState<
    Pick<StoreConfig, 'storeAddress' | 'isReady'>
  >({
    storeAddress: initStoreAddress,
    isReady: Boolean(!initOwnerAddress || initStoreAddress),
    solramaCostToMint: initSolramaCostToMint,
  });

  const setStoreForOwner = useMemo(
    () => async (ownerAddress?: string) => {
      const storeAddress = await getStoreID(ownerAddress);
      setProgramIds(storeAddress); // fallback
      setStore({ storeAddress, isReady: true });
      console.log(`CUSTOM STORE: ${storeAddress}`);
      return storeAddress;
    },
    [],
  );

  useEffect(() => {
    console.log(`STORE_OWNER_ADDRESS: ${initOwnerAddress} Cost to mint ${initSolramaCostToMint}`);
    if (initOwnerAddress && !initStoreAddress) {
      setStoreForOwner(initOwnerAddress);
    } else {
      setProgramIds(initStoreAddress); // fallback
      console.log(`CUSTOM STORE FROM ENV: ${initStoreAddress} Cost to mint ${initSolramaCostToMint}`);
    }
  }, [initOwnerAddress]);

  return (
    <StoreContext.Provider value={{ ...store, setStoreForOwner, isConfigured, solramaCostToMint }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  return useContext(StoreContext);
};
