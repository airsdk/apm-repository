import Spinner from '../common/Spinner'
import ErrorMessage from '../common/ErrorMessage'
import Date from '../common/Date'
import PackageIcon from './PackageIcon'
import styled from 'styled-components'
import { useState } from 'react';

import { Package } from 'types/model'

import styles from './PackageContent.module.css'

import PackageContentReadme from './PackageContentReadme'
import PackageContentDependencies from './PackageContentDependencies'
import PackageContentChangelog from './PackageContentChangelog'
import PackageContentInfoPanel from './PackageContentInfoPanel'
import PackageContentVersions from './PackageContentVersions'

export const TabNav = styled.div`
  border-bottom: 1px dashed #ed1c23;
  display: flex;
`;


interface TabProps {
   selected: boolean;
};

export const Tab = styled.button<TabProps>`
  padding: 1em;
  cursor: pointer;
  border: 0;
  outline: 0;
  background-color: #fff;
  opacity: 0.6;
  font-size: 15px;

  ${({ selected }) =>
    selected ?
    `
    background-color: #ed1c23;
    color: #fff;
    opacity: 1;
    `
  :
    `
    `
  }
`;


const tabs = [
  {
    id: 'readme',
    name: 'Readme',
  },
  {
    id: 'changelog',
    name: 'Changelog',
  },
  {
    id: 'dependencies',
    name: 'Dependencies',
  },
  {
    id: 'versions',
    name: 'Versions',
  },
  ];

export default function PackageContent({
    packageData,
    isLoading,
    isError,
  }: {
    packageData: Package | undefined;
    isLoading: boolean;
    isError: boolean;
  }) {

    const [active, setActive] = useState(tabs[0]);


    if (isLoading) return <Spinner />;
    if (isError || packageData === undefined || packageData.versions === undefined) return <ErrorMessage />;

    // console.log( JSON.stringify(packageData));

    return (
        <div className={styles.container} >
            
            <div className={styles.title}>
                {/* TITLE */}
                <PackageIcon type={packageData.type} />
                <span className={styles.titleName}>{packageData.name}</span>
                <small>[{packageData.identifier}]</small>
            </div>

            <div className={styles.summary}>
              {/* SUMMARY */}
              <span className={styles.version}>v{packageData.versions[0].version}</span>
              &nbsp; - &nbsp;
              <span>{packageData?.license === undefined || packageData?.license.public ? "Public" : "Private"}</span>
              &nbsp; - &nbsp;
              <span className={styles.publishedDate}>Published <Date dateString={packageData.versions[0].publishedAt} /></span>
            </div>

            <div className={styles.section}>
              {/* TABS  */}
              <TabNav>
                {tabs.map( tab => (
                  <Tab 
                    key={tab.id} 
                    selected={active.id === tab.id}
                    onClick={() => setActive(tab)}>
                    <a href={'#' + tab.id}>
                      {tab.name}
                    </a>
                  </Tab>
                ))}
              </TabNav>

              <div className={styles.contentContainer}>
                <div className={styles.tabContainer}>
                    {active.id === 'readme' && <PackageContentReadme packageData={packageData}/>}
                    {active.id === 'changelog' && <PackageContentChangelog packageData={packageData}/>}
                    {active.id === 'dependencies' && <PackageContentDependencies packageData={packageData}/>}
                    {active.id === 'versions' && <PackageContentVersions packageData={packageData}/>}
                </div>

                <div className={styles.infoPanel}>
                  <PackageContentInfoPanel packageData={packageData}>
                    {/* INFO PANEL */}
                  </PackageContentInfoPanel>
                </div>
              </div>
            </div>


        </div>
    );

}