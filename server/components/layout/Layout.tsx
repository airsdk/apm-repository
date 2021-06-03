import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "./Layout.module.css";

export const siteTitle = "AIR Package Repository";
export const siteDescription = "AIR Package Repository";

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode;
  home?: boolean;
}) {
  return (
    <div className={styles.container}>
      <Head>
        <script src="https://kit.fontawesome.com/61428cba37.js" crossorigin="anonymous"></script>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={siteDescription} />
        <meta property="og:image" content={``} />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />

        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&family=Noto+Sans+JP&family=Open+Sans&family=Roboto&family=Lato&display=swap" rel="stylesheet" />
      </Head>

      <header className={styles.header}></header>

      <main>{children}</main>
    </div>
  );
  return <div>{children}</div>;
}
