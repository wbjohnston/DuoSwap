

import DuoSwapLayout from '../components/DuoSwapLayout';
import '../styles.css';
import { DAppProvider } from "@usedapp/core"
import { useConfig } from '../hooks/useConfig';
import { getUseDappProviderConfigFromConfig } from '../lib/Config';

// This default export is required in a new `pages/_app.js` file.
export default function DuoSwapApp({ Component, pageProps }) {
    const config = useConfig()
    const dAppProviderConfig = getUseDappProviderConfigFromConfig(config);

    return <DAppProvider config={dAppProviderConfig}>
        <DuoSwapLayout>
            <Component {...pageProps} />
        </DuoSwapLayout>
    </DAppProvider>

}