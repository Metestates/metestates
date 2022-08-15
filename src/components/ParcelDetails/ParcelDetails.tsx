import React, { FC } from 'react';

import Parcel from '../../types/parcel';

import { shortenAddress } from '../../utils/address';

import styles from './ParcelDetails.module.scss';

type ParcelDetailsProps = React.PropsWithChildren<{
  parcel: Parcel;
}>

const ParcelDetails: FC<ParcelDetailsProps> = ({ parcel }) => {

  return (
    <ul className={styles.ParcelDetails} data-testid="ParcelDetails">

      <li key='owner'>
        Owner:
        {shortenAddress(parcel.owner.address)}
      </li>

      <li key='coordinate'>
        Coordinate:
        {parcel.x}, {parcel.y}
      </li>

      {
        parcel.estate &&
        <li key='estate'>
          Estate:
          {parcel.estate.owner.address}
        </li>
      }

      {
        parcel.data?.name &&
        <li key='name'>
          Name:
          {parcel.data?.name}
        </li>
      }

      {
        parcel.data?.description &&
        <li key='description'>
          Description:
          {parcel.data?.description}
        </li>
      }

      {
        parcel.data?.ipns &&
        <li key='ipns'>
          IPNS:
          <a href={parcel.data?.ipns} target='_blank' rel='noreferrer'>
            {parcel.data?.ipns}
          </a>
        </li>
      }

  </ul>
  )

}

export default ParcelDetails;
