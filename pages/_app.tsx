import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import './globals.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import Head from 'next/head';
config.autoAddCss = false;
library.add(fas, fab);

export default function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          {/* Add other meta tags or links here */}
        </Head>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}
