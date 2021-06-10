
import Link from "next/link";
import Date from "../common/Date"
import styles from "./SearchResult.module.css";
import PackageIcon from './PackageIcon'
import { Package } from 'types/package'


export default function SearchResult({ packageData }: { packageData: Package }) {

  return (
    <div className={styles.resultContainer}>
      <div className={styles.title}>
        <h1>
          <a href={`/packages/${packageData.identifier}`}>
            <div>
                <PackageIcon type={packageData.type} />
                <span className={styles.titleName}>{packageData.name}</span>
                <small>[{packageData.identifier}]</small>
            </div>
          </a>
        </h1>
      </div>
      <div className={styles.content}>
        <small>type: {packageData.type}</small>
        <p>{packageData.description}</p>
        <div className={styles.metadata}>
            <span className={styles.version}>v{packageData.version}</span>  • Published: <Date dateString={packageData.publishedAt} />
        </div>

        <div className={styles.link}>
          <a target="_blank" href={packageData.url}>
            more information <i className='fa fa-external-link'></i>
          </a>
        </div>
      </div>
    </div>
  );
}
