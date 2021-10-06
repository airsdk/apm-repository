
import React from 'react'
import styles from './NavBar.module.css'


export default function NavBar ({home, children } : {home?:boolean, children?:React.ReactNode}) {
    return (
        <div>
            { home ? (
                <>

                </>
            )
            : (
                <>
                    <div className={styles.navbar}>
                        <div>
                            <a href="/">
                                <img src="/images/logo.svg" className={styles.navbarLogo} alt="AIR" width={32} height={32}  /> 
                                <strong className={styles.title}>AIR Package Repository</strong>
                            </a>
                        </div>
                        <div>
                            {children}
                        </div>
                    </div>
                </>
            ) }

        </div>
    )
}