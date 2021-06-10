import Head from "next/head";

import Layout, { siteTitle } from "../components/layout/Layout";
import NavBar from "../components/layout/NavBar";
import SearchBar from "../components/search/SearchBar";

import styles from "../styles/index.module.css";

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
            <a href="https://github.com/airsdk/apm" className={styles.card}>
              <h2>APM &rarr;</h2>
              <p>
                Find in-depth information about <code>apm</code>, the AIR
                Package Manager utility.
              </p>
            </a>

            <a
              href="https://github.com/airsdk/apm-repository"
              className={styles.card}
            >
              <h2>Contribute &rarr;</h2>
              <p>Contribute to the developmment of this repository.</p>
            </a>

            <a
              href="https://github.com/airsdk/apm/wiki"
              className={styles.card}
            >
              <h2>Learn &rarr;</h2>
              <p>
                Learn about <code>apm</code> in the GitHub wiki!
              </p>
            </a>

            <a href="https://airsdk.dev" className={styles.card}>
              <h2>AIR SDK &rarr;</h2>
              <p>Find out more about AIR and the AIR SDK.</p>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
