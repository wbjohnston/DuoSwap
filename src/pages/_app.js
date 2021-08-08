

import DuoSwapLayout from '../components/DuoSwapLayout';
import '../styles.css';
import { DAppProvider } from "@usedapp/core"

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
    return <DAppProvider>
        <DuoSwapLayout>
            <Component {...pageProps} />
        </DuoSwapLayout>
    </DAppProvider>
    
}