import unified from "unified";
import parse from "remark-parse";
import remark2react from "remark-react";
import { ReactElement } from "react";

import { Package } from 'types/model'

import styles from './PackageContentChangelog.module.css'


function NoChangelog() {
  return <div>...</div> 
}


export default function PackageContentChangelog({
  packageData,
}: {
  packageData: Package | undefined;
}) {
  if (packageData === undefined || packageData?.versions[0].changelog == null || packageData?.versions[0].changelog.length === 0) {
    return (
      <div className={styles.container}>
        <NoChangelog />
      </div>
    );
  }

  const content = unified()
    .use(parse)
    .use(remark2react)
    .processSync(packageData?.versions[0].changelog).result as ReactElement;

  return <div className={styles.changelog}>{content}</div>;
}