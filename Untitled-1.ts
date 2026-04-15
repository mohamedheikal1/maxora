npm i @vercel/speed-insights
yarn add @vercel/speed-insights
pnpm i @vercel/speed-insights
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { AppProps } from 'next/app';
import { SpeedInsights } from '@vercel/speed-insights/next';
 
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <SpeedInsights />
    </>
  );
}
 
export default MyApp;