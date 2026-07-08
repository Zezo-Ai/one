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

import { createTable } from '@UtilsModule'
import { VrAPI } from '@FeaturesModule'
import { StatusTag } from '@ComponentsV2Module'
import { T } from '@ConstantsModule'
import {
  getVirtualRouterLocked,
  getVirtualRouterTotalNics,
  getVirtualRouterTotalVms,
} from '@modules/models/VirtualRouter/general'
import { createLabelColumn } from '@modules/models/labels'

/* eslint-disable jsdoc/require-jsdoc */
export const VR_COLUMNS = [
  { header: T.ID, id: 'id', accessorKey: 'ID', width: '5%' },
  { header: T.Name, id: 'name', accessorKey: 'NAME' },
  { header: T.Owner, id: 'owner', accessorKey: 'UNAME' },
  { header: T.Group, id: 'group', accessorKey: 'GNAME' },
  {
    header: `${T.Template} ${T.ID}`,
    id: 'template',
    accessorKey: 'TEMPLATE_ID',
  },
  {
    header: T.TotalVms,
    id: 'vms',
    accessorFn: getVirtualRouterTotalVms,
  },
  {
    header: T.NIC,
    id: 'nics',
    accessorFn: getVirtualRouterTotalNics,
  },
  {
    header: T.Locked,
    id: 'locked',
    accessorFn: getVirtualRouterLocked,
    cell: ({ row }) =>
      row.original?.LOCK ? (
        <StatusTag statusColor="information" statusName={T.Locked} />
      ) : (
        '-'
      ),
  },
  createLabelColumn(),
]

export const vrTable = createTable(VR_COLUMNS, VrAPI.useGetVrsQuery)
