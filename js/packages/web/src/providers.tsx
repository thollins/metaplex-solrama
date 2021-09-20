import {
  AccountsProvider,
  ConnectionProvider,
  StoreProvider,
  WalletProvider,
  MetaProvider,
} from '@oyster/common';
import { FC } from 'react';
import { ConfettiProvider } from './components/Confetti';
import { AppLayout } from './components/Layout';
import { CoingeckoProvider } from './contexts/coingecko';
import { processAccountsIntoAuctionView } from './hooks';

export const Providers: FC = ({ children }) => {
  return (
    <ConnectionProvider>
      <WalletProvider>
          <AccountsProvider>
            <CoingeckoProvider>
              <StoreProvider
                ownerAddress={process.env.NEXT_PUBLIC_STORE_OWNER_ADDRESS}
                storeAddress={process.env.NEXT_PUBLIC_STORE_ADDRESS}
                //Converting to number here so we can use the same variable throughout. Renamed to NEXT_.. so it is similar to others
                solramaCostToMint={Number(process.env.NEXT_SOLRAMA_IO_COST_TO_MINT)}
              >
                <MetaProvider>
                  <ConfettiProvider>
                    <AppLayout>{children}</AppLayout>
                  </ConfettiProvider>
                </MetaProvider>
              </StoreProvider>
            </CoingeckoProvider>
          </AccountsProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
