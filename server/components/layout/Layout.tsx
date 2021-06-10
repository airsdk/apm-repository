import Head from "next/head";
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
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={siteDescription} />
        <meta property="og:image" content={``} />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />

        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&family=Noto+Sans+JP&family=Open+Sans&family=Roboto&family=Lato&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
      </Head>

      <header className={styles.header}></header>

      <main>{children}</main>

      <footer className={styles.footer}>
        <a
          href="https://airsdk.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          
          <span className={styles.logo}>
            <img src="/images/logo.svg" alt="AIR SDK" width={32} height={32} />
          </span>
          {' '}AIR SDK
        </a>
      </footer>

    </div>

    
  );
  return <div>{children}</div>;
}
