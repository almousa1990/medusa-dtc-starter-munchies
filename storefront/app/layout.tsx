import {cx} from "cva";
import {
  Climate_Crisis,
  IBM_Plex_Sans_Arabic,
  Baloo_Bhaijaan_2,
} from "next/font/google";

import dynamicFavicon from "./dynamic-favicon";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-ibmPlex",
  weight: ["400", "500", "600", "700"],
});
const balooBhaijaan = Baloo_Bhaijaan_2({
  subsets: ["latin"],
  variable: "--font-balooBhaijaan",
  weight: ["400"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cx(
        ibmPlexSans.variable,
        balooBhaijaan.variable,
        "overflow-x-clip overscroll-none scroll-smooth",
      )}
      lang="en"
    >
      <head>
        <link href="/favicon.ico" rel="icon" type="image/x-icon" />
        <script dangerouslySetInnerHTML={{__html: dynamicFavicon}} />
      </head>
      {children}
    </html>
  );
}
