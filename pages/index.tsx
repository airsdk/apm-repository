import Head from "next/head";

import Layout, { siteTitle } from "../components/layout/Layout";
import NavBar from "../components/layout/NavBar";
import SearchBar from "../components/search/SearchBar";

import styles from "./index.module.css";

export default function HomePage() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <NavBar home></NavBar>

      <section className={styles.banner}>
        <h1 className={styles.title}>
          <img
            src="/images/logo.svg"
            className={styles.titleLogo}
            alt="AIR"
            width={60}
            height={60}
          />{" "}
          AIR Package Repository
        </h1>

        <SearchBar home></SearchBar>

        <p className={styles.description}>
          Find and use packages to build <a href="https://airsdk.dev">AIR</a>{" "}
          applications.
        </p>
      </section>

      <section className="contentContainer">
        <div className={styles.main}>
          <div className={styles.grid}>
            <a
              href="https://github.com/airsdk/apm/discussions/31"
              className={styles.card}
            >
              <h2>Get started &rarr;</h2>
              <p>Get started using package management in your AIR project!</p>
            </a>

            <a
              href="https://github.com/airsdk/apm/wiki"
              className={styles.card}
            >
              <h2>APM &rarr;</h2>
              <p>
                Find in-depth information about <code>apm</code> , the{" "}
                <i>AIR Package Manager</i> utility.
              </p>
            </a>

            <a href="https://airsdk.dev" className={styles.card}>
              <h2>AIR SDK &rarr;</h2>
              <p>
                Find out more about AIR and the AIR SDK in the AIR developer
                portal.
              </p>
            </a>

            <a
              href="https://github.com/airsdk/apm-repository"
              className={styles.card}
            >
              <h2>Contribute &rarr;</h2>
              <p>
                Contribute to the developmment of this repository in GitHub.
              </p>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
