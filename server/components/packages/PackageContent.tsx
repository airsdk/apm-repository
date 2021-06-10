import Spinner from '../common/Spinner'
import ErrorMessage from '../common/ErrorMessage'
import Date from '../common/Date'

import { Package } from 'types/package'

import styles from './PackageContent.module.css'

export default function PackageContent({
    packageData,
    isLoading,
    isError,
  }: {
    packageData: Package | undefined;
    isLoading: boolean;
    isError: boolean;
  }) {
    if (isLoading) return <Spinner />;
    if (isError || packageData == undefined) return <ErrorMessage />;

    console.log( JSON.stringify(packageData));

    return (
        <div className={styles.container} >
            
            <div className={styles.title}>
                <h1>{packageData.name} <span className={styles.version}>v{packageData.version}</span></h1>
            </div>

            <p className={styles.publishedDate}>Published <Date dateString={packageData.publishedAt} /></p>
        </div>
    );

}