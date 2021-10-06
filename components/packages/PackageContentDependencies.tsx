import Spinner from '../common/Spinner'
import ErrorMessage from '../common/ErrorMessage'
import Date from '../common/Date'
import PackageIcon from './PackageIcon'
import styled from 'styled-components'
import { useState } from 'react';

import { Package } from 'types/model'

import styles from './PackageContentDependencies.module.css'



export default function PackageContentDependencies({
    packageData,
  }: {
    packageData: Package | undefined;
  }) {


    return (
        <div className={styles.container} >
          <h3>Dependencies ({packageData?.versions[0].dependencies.length})</h3>
          <ul>
            { packageData?.versions[0].dependencies.map( dependency => 
              <li key={dependency.index}>
                <a href={'/packages/'+dependency.package?.identifier}>
                  {dependency.package?.identifier}@{dependency.version}
                </a>
              </li>
            )}
          </ul>
        </div>
    );

}