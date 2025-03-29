import {cx} from "cva";
import {IBM_Plex_Sans_Arabic, Rubik} from "next/font/google";
import {NuqsAdapter} from "nuqs/adapters/next/app";

import dynamicFavicon from "./dynamic-favicon";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-ibmPlex",
  weight: ["400", "500", "600", "700"],
});
const rubik = Rubik({
  subsets: ["arabic"],
  variable: "--font-rubik",
  weight: ["400", "500", "600", "700"],
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
        rubik.variable,
        "overflow-x-clip overscroll-none scroll-smooth",
      )}
      lang="en"
    >
      <head>
        <link href="/favicon.ico" rel="icon" type="image/x-icon" />
        <script dangerouslySetInnerHTML={{__html: dynamicFavicon}} />
      </head>
      <NuqsAdapter>{children}</NuqsAdapter>
    </html>
  );
}
