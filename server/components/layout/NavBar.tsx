
import styles from './NavBar.module.css'


export default function NavBar ({home} : {home?:boolean}) {
    return (
        <div>
            { home ? (
                <>

                </>
            )
            : (
                <>
                    <div className={styles.navbar}>
                        <a href="/">
                            <img src="/images/logo.svg" className={styles.navbarLogo} alt="AIR" width={32} height={32}  /> 
                            <strong className={styles.title}>AIR Package Repository</strong>
                        </a>
                    </div>
                </>
            ) }

        </div>
    )
}