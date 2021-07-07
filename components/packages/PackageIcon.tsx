
import styles from './PackageIcon.module.css'

export default function PackageIcon({type} : {type:string}) {
    if (type == "ane") return <img className={styles.icon} src="/images/icon-ane.png" />
    else if (type == "swc") return <img className={styles.icon} src="/images/icon-swc.png" />
    else return <img className={styles.icon} src="/images/icon-swc.png" />

    // <i className="fa fa-archive" aria-hidden="true"></i> 
}