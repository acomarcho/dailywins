import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { raleway, lato } from "@/lib/fonts";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${raleway.variable} ${lato.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}
