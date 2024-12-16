import "@/styles/globals.css";
import type { AppProps } from "next/app";
import ApplicationLayout from "@/components/ApplicationLayout";
import ApplicationProviders from "@/providers/ApplicationProviders"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApplicationProviders>
      <ApplicationLayout>
        <Component {...pageProps} />
      </ApplicationLayout>
    </ApplicationProviders>
  );
}
