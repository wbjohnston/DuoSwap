
import DuoSwapLayout from '../components/DuoSwapLayout';
import '../styles.css';
import { DAppProvider } from "@usedapp/core"
import { useConfig } from '../hooks/useConfig';
import { getUseDappProviderConfigFromConfig } from '../lib/Config';
import React from 'react';

// This default export is required in a new `pages/_app.js` file.
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function DuoSwapApp({ Component, pageProps }) {
    const config = useConfig()
    const dAppProviderConfig = getUseDappProviderConfigFromConfig(config);

    return <DAppProvider config={dAppProviderConfig}>
        <DuoSwapLayout>
            <Component {...pageProps} />
        </DuoSwapLayout>
    </DAppProvider>

}