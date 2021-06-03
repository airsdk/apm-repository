import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import Layout, { siteTitle } from "../../components/layout/Layout";
import NavBar from "../../components/layout/NavBar";
import PackageContent from "../../components/packages/PackageContent";

import styles from "./index.module.css";

import {findOne} from '../../lib/queries'

const Package = () => {
  const router = useRouter();
  const { packageId } = router.query;

  const { data, isLoading, isError } = findOne(String(packageId));
  
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <NavBar></NavBar>

      <section className="contentContainer">
        <PackageContent packageData={data} isLoading={isLoading} isError={isError}></PackageContent>
      </section>

    </Layout>
  );
};

export default Package;
