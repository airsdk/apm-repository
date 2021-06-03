import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

const Package = () => {
  const router = useRouter();
  const { packageId } = router.query;

  return <p> Package: {packageId}</p>;
};

export default Package;
