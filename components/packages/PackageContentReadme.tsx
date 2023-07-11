import { Package } from "types/model";

import styles from "./PackageContentReadme.module.css";

import {unified} from "unified";
import remarkParse from "remark-parse";
import remarkReact from "remark-react";
import { createElement, useState, ReactElement } from "react";

function NoReadme() {
  return (
    <div>
      This package does not have a README. Add a README to your package so that
      users know how to get started.
    </div>
  );
}

export default function PackageContentReadme({
  packageData,
}: {
  packageData: Package | undefined;
}) {

  if (packageData === undefined || packageData?.readme.length === 0) {
    return (
      <div className={styles.container}>
        <NoReadme />
      </div>
    );
  }

  const content = unified()
    .use(remarkParse)
    .use(remarkReact, { createElement })
    .processSync(packageData?.readme).result as ReactElement;

  return <div className={styles.readme}>{content}</div>;
}
