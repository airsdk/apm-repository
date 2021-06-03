import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import Layout, { siteTitle } from "../../components/layout/Layout";
import NavBar from "../../components/layout/NavBar";
import SearchBar from "../../components/search/SearchBar";
import SearchResults from "../../components/packages/SearchResults";

import styles from "./index.module.css";

import {findMany } from '../../lib/queries'

const Packages = () => {
  const router = useRouter();
  const { q } = router.query;
  console.log(q);

  const { packages, isLoading, isError } = findMany(String(q));

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <NavBar></NavBar>

      <section className={styles.banner}>
        <SearchBar text={String(q)}></SearchBar>
      </section>

      <section className="contentContainer">
        <SearchResults query={String(q)} packages={packages} isLoading={isLoading} isError={isError} />
      </section>
      
    </Layout>
  );
};

export default Packages;
