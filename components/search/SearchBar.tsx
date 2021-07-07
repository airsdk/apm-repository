import styles from "./SearchBar.module.css";

export default function SearchBar({
  home,
  text,
}: {
  home?: boolean;
  text?: string;
}) {
  return (
    <div className={styles.search}>
      <form action="packages" className={styles.searchForm}>
        {home ? (
          <>
            <input
              name="q"
              type="text"
              className={styles.searchInputHome}
              placeholder="Search packages"
              autoFocus
              defaultValue={text}
            />
            <button type="submit" className={styles.iconHome}></button>
          </>
        ) : (
          <>
            <input
              name="q"
              type="text"
              className={styles.searchInput}
              placeholder="Search packages"
              defaultValue={text}
            />
            <button type="submit" className={styles.icon}></button>
          </>
        )}
      </form>
    </div>
  );
}
