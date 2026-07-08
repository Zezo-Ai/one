/* ------------------------------------------------------------------------- *
 * Copyright 2002-2026, OpenNebula Project, OpenNebula Systems               *
 *                                                                           *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may   *
 * not use this file except in compliance with the License. You may obtain   *
 * a copy of the License at                                                  *
 *                                                                           *
 * http://www.apache.org/licenses/LICENSE-2.0                                *
 *                                                                           *
 * Unless required by applicable law or agreed to in writing, software       *
 * distributed under the License is distributed on an "AS IS" BASIS,         *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
 * See the License for the specific language governing permissions and       *
 * limitations under the License.                                            *
 * ------------------------------------------------------------------------- */

import { T } from '@ConstantsModule'
import { Image } from '@ComponentsV2Module'
import { ProviderAPI } from '@FeaturesModule'
import { createTable, timeFromMilliseconds } from '@UtilsModule'
import { getLogoSource } from '@modules/models/Provider/general'

/* eslint-disable jsdoc/require-jsdoc */
export const PROVIDER_COLUMNS = [
  {
    id: 'logo',
    width: '10%',
    header: '',
    cell: ({ row }) => {
      const src = getLogoSource(
        row?.original?.TEMPLATE?.PROVIDER_BODY?.fireedge
      )

      return (
        <Image src={src} width={40} height={40} alt={'list-image-identifier'} />
      )
    },
  },
  {
    header: T.ID,
    accessorKey: 'ID',
    id: 'id',
    width: '5%',
  },
  {
    header: T.Name,
    accessorKey: 'NAME',
    id: 'name',
    width: '30%',
  },
  {
    header: T.Owner,
    accessorKey: 'UNAME',
    id: 'owner',
  },
  {
    header: T.Group,
    accessorKey: 'GNAME',
    id: 'group',
  },
  {
    header: T.NumberProvisions,
    id: 'number_provisions',
    accessorFn: (row) =>
      String(row?.TEMPLATE?.PROVIDER_BODY?.provision_ids?.length ?? 0),
  },
  {
    header: T.RegistrationTime,
    id: 'time',
    cell: ({ row }) => {
      const registrationTime =
        row?.original?.TEMPLATE?.PROVIDER_BODY?.registration_time

      return registrationTime
        ? timeFromMilliseconds(+registrationTime).toRelative()
        : '-'
    },
  },
]

export const providerTable = createTable(
  PROVIDER_COLUMNS,
  ProviderAPI.useGetProvidersQuery
)
