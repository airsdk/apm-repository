import Head from 'next/head'
import Image from 'next/image'

import Layout, {siteTitle} from '../components/layout/Layout'
import NavBar from '../components/layout/NavBar'
import SearchBar from '../components/search/SearchBar'

import styles from '../styles/index.module.css'

export default function Home() {
  return (
      <Layout home>

        <Head>
          <title>{siteTitle}</title>
        </Head>

        <NavBar home></NavBar>

        <section className={styles.banner}>

          <h1 className={styles.title}>
            <img src="/images/logo.svg" className={styles.titleLogo} alt="AIR" width={60} height={60}  /> AIR Package Repository
          </h1>

          <SearchBar home></SearchBar>

          <p className={styles.description}>
            Find and use packages to build <a href="https://airsdk.dev">AIR</a> applications.
          </p>
        </section>

      </Layout>

  )
}
