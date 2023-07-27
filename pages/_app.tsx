import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { raleway, lato } from "@/lib/fonts";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>DailyWins</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Notifications position="top-center" />
        <main className={`${raleway.variable} ${lato.variable}`}>
          <Component {...pageProps} />
        </main>
      </MantineProvider>
    </>
  );
}
