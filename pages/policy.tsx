import Head from "next/head";

import Layout, { siteTitle } from "../components/layout/Layout";
import NavBar from "../components/layout/NavBar";
import SearchBar from "../components/search/SearchBar";

import styles from "./policy.module.css";

export default function PolicyPage() {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <NavBar></NavBar>

      <section className={styles.content}>
        <div className={styles.contentSection}>
          <h2>AIR Package Repository policy</h2>
        </div>
        <div className={styles.contentSection}>
          <h3>Purpose</h3>
          <p>
            This site facilitates the sharing via publication of air packages
            via{" "}
            <a href="https://github.com/airsdk/apm">
              <code>apm</code>
            </a>
            . It is central to this service that consumers of packages can trust
            that their dependencies do not suddenly disappear.{" "}
            <strong>
              Thus, once a package has been published it cannot be unpublished
              or deleted.
            </strong>{" "}
            This applies to all versions of a published package. If something
            has been published that is no longer relevant or maintained, as a
            publisher, you can mark the package as discontinued, which will make
            the package disappear from searches (but keep it available to those
            that already depend on it).
          </p>
          <p>
            We do grant exceptions to this policy at the discretion of the
            repository moderators. To get an exception you must email{" "}
            <a href="mailto:distriqt@distriqt.com">distriqt@distriqt.com</a>{" "}
            outlining your issue and why the package should be removed. For
            example,
            <ul>
              <li>
                if you publish a package by mistake and contact the moderators
                quickly, the moderators will check that no widespread usage of
                the package has begun and may remove the package;
              </li>
              <li>
                if a package violates the Naming, Content, or Copyright policies
                below, and a user files a moderation request;
              </li>
            </ul>
          </p>
        </div>
        <div className={styles.contentSection}>
          <h3>Identifier naming policy</h3>
          <p>
            The package identifier forms an important role in the system and
            must be unique. When a developer installs your package they will use
            the unique identifier as a reference to your package.
          </p>
          <p>
            Because they have such an important role the following policies
            affect the usage of identifiers:
          </p>
          <h4>Squatting</h4>
          <p>
            Packages may not be published solely to reserve an identifier for
            future use. A package is considered to be name squatting if the
            package contains no code or libraries that have a useful purpose. We
            do not scan for packages but rely on the community and moderators to
            manually identify packages deemed to be name squatting. If you
            believe a package is name squatting follow the steps below:
            <ul>
              <li>
                contact the publisher (via email) as shown on the site and copy
                distriqt@distriqt.com;
              </li>
              <li>
                politely ask the publisher to explain their intended purpose;
              </li>
              <li>
                if the publisher does not respond forward the thread to
                distriqt@distriqt.com and a moderator will review;
              </li>
            </ul>
          </p>
          <h4>Trademark infringement</h4>
          <p>
            We respect the importance of trademarks, other proprietary rights
            and prohibit intellectual property infringement. Publishers are
            solely responsible for the packages and package names they use. We
            are not in a position to mediate disputes and encourage owners to
            resolve their disputes directly with publishers by contacting them.
          </p>
        </div>
        <div className={styles.contentSection}>
          <h3>Content policy</h3>
          <p>
            This repository is intended to enable developers to share AIR
            packages with other developers. Packages are expected to contain AIR
            libraries (ANE/SWC), actionscript source code and assets (images,
            audio, etc) directly related to the functionality of the package.
            Any other content is not allowed and may be subject to moderation at
            the discretion of the moderators and may result in the unpublishing
            of a package.{" "}
          </p>
        </div>
        <div className={styles.contentSection}>
          <h3>Copyright policy</h3>
          <p>
            We respect the rights of copyright holders, and we do not allow
            packages or package names that are unauthorized to use copyrighted
            content. If you have a complaint about a copyright infringement you
            can email the moderators at distriqt@distriqt.com. Make sure you
            include the name and role of the person initiating the compliant and
            details around the infringement (including description, urls,
            examples that demonstrate the infringement).
          </p>
        </div>
      </section>
    </Layout>
  );
}
