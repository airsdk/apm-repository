import Spinner from '../common/Spinner'
import ErrorMessage from '../common/ErrorMessage'
import Date from '../common/Date'
import PackageIcon from './PackageIcon'
import styled from 'styled-components'
import { useState } from 'react';

import { Package, PackageVersion } from 'types/model'

import styles from './PackageContentVersions.module.css'



export default function PackageContentVersions({
    packageData,
  }: {
    packageData: Package | undefined;
  }) {

    return (
        <div className={styles.container} >
            
          <h3>Versions ({packageData?.versions.length})</h3>
          <ul>
            {packageData?.versions.map( (version:PackageVersion) => 
                <li key={version.index}>{version.version}</li>
            )}
          </ul>

        </div>
    );

}