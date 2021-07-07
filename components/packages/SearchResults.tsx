import styles from "./SearchResults.module.css";
import SearchResult from "./SearchResult";
import Spinner from '../common/Spinner'
import ErrorMessage from '../common/ErrorMessage'
import type { Package } from 'types/package'

export default function SearchResults({
  query,
  packages,
  isLoading,
  isError,
}: {
  query: string;
  packages: Array<Package> | undefined;
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) return <Spinner />;
  if (isError || packages == undefined) return <ErrorMessage />;

  return (
    <div className={styles.resultsContainer}>
      <section className={styles.resultsSummary}>
        <strong>
          Found <code>{packages.length}</code> packages for search query{" "}
          <code>{query}</code>
        </strong>
      </section>
      <section className={styles.resultsList}>
        {packages.map((p) => (
          <div key={p.index} className={styles.packageContainer}>
            <SearchResult packageData={p}></SearchResult>
          </div>
        ))}
      </section>
    </div>
  );
}
