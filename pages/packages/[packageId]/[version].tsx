import Head from "next/head";
import { useRouter } from "next/router";

import Layout, { siteTitle } from "components/layout/Layout";
import NavBar from "components/layout/NavBar";
import PackageContent from "components/packages/PackageContent";
import SearchBar from "components/search/SearchBar";

import styles from "../index.module.css";

import {findVersion} from '../../../lib/queries'

const PackagePage = () => {
  const router = useRouter();
  const { packageId, version } = router.query;

  const { data, isLoading, isError } = findVersion(String(packageId), String(version) );
  
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}: {packageId}</title>
      </Head>

      <NavBar></NavBar>
      
      <section className={styles.banner}>
        <SearchBar></SearchBar>
      </section>

      <section className="contentContainer">
        <PackageContent packageData={data} isLoading={isLoading} isError={isError}></PackageContent>
      </section>

    </Layout>
  );
};

export default PackagePage;
