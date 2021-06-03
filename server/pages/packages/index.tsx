import Head from "next/head";
import Image from "next/image";
import useSWR from 'swr';
import { useRouter } from "next/router";


import Layout, {siteTitle} from '../../components/layout/Layout'
import NavBar from '../../components/layout/NavBar'
import SearchBar from '../../components/search/SearchBar'

import styles from './index.module.css'

const fetcher = (...args) => fetch(...args).then(res => res.json())


function search(searchQuery:String) {

  const { data, error } = useSWR(`/api/search/?q=${searchQuery}`, fetcher)

  console.log( data );

  return {
    packages: data,
    isLoading: !error && !data,
    isError: error
  }
}


const Packages = () => {
    const router = useRouter();
    const { q } = router.query;
    const { packages, isLoading, isError } = search( String(q) );


    return (
      <Layout home>

      <Head>
        <title>{siteTitle}</title>
      </Head>

      <NavBar></NavBar>

      <section className={styles.banner}>
      
        <SearchBar text={String(q)}></SearchBar>
      
      </section>

      </Layout>
    )

    return <p> Search: <pre>{String(packages)}</pre></p>;
};

export default Packages;
