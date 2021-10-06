import { Package } from "types/model";

import styles from "./PackageContentReadme.module.css";

import unified from "unified";
import parse from "remark-parse";
import remark2react from "remark-react";
import { ReactElement } from "react";

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
    .use(parse)
    .use(remark2react)
    .processSync(packageData?.readme).result as ReactElement;

  return <div className={styles.readme}>{content}</div>;
}
