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
  solramaCostToMint: number;
}

export const StoreContext = createContext<StoreConfig>(null!);

export const StoreProvider: FC<{
  ownerAddress?: string;
  storeAddress?: string;
  solramaCostToMintS?: string;
}> = ({ children, ownerAddress, storeAddress, solramaCostToMintS }) => {
  const searchParams = useQuerySearch();
  const ownerAddressFromQuery = searchParams.get('store');

  const initOwnerAddress = ownerAddressFromQuery || ownerAddress;
  const initStoreAddress = !ownerAddressFromQuery ? storeAddress : undefined;
  const initSolramaCostToMint = !solramaCostToMintS ? Number(solramaCostToMintS) : 0.001;
  const isConfigured = Boolean(initStoreAddress || initOwnerAddress);

  const [store, setStore] = useState<
    Pick<StoreConfig, 'storeAddress' | 'isReady' | 'solramaCostToMint'>
  >({
    storeAddress: initStoreAddress,
    isReady: Boolean(!initOwnerAddress || initStoreAddress),
    solramaCostToMint: initSolramaCostToMint
  });

  const setStoreForOwner = useMemo(
    () => async (ownerAddress?: string) => {
      const storeAddress = await getStoreID(ownerAddress);
      setProgramIds(storeAddress); // fallback
      setStore({ storeAddress, isReady: true, solramaCostToMint: 0.001 });
      console.log(`CUSTOM STORE: ${storeAddress}`);
      return storeAddress;
    },
    [],
  );

  useEffect(() => {
    console.log(`STORE_OWNER_ADDRESS: ${initOwnerAddress}`);
    if (initOwnerAddress && !initStoreAddress) {
      setStoreForOwner(initOwnerAddress);
    } else {
      setProgramIds(initStoreAddress); // fallback
      console.log(`CUSTOM STORE FROM ENV: ${initStoreAddress}`);
    }
  }, [initOwnerAddress]);

  return (
    <StoreContext.Provider value={{ ...store, setStoreForOwner, isConfigured}}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  return useContext(StoreContext);
};
