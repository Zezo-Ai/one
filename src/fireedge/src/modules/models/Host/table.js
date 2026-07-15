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

import { getHostState, getAllocatedInfo } from '@modules/models/Host/general'
import { T } from '@ConstantsModule'
import { createTable, getTotalOfResources } from '@UtilsModule'
import { HostAPI } from '@FeaturesModule'
import { StatusTag } from '@ComponentsV2Module'
import { createLabelColumn } from '@modules/models/labels'

/* eslint-disable jsdoc/require-jsdoc */
export const HOST_COLUMNS = [
  {
    header: T.ID,
    accessorKey: 'ID',
    id: 'id',
    sortType: 'number',
    width: '5%',
  },
  {
    header: T.Name,
    id: 'name',
    accessorFn: (row) => row?.TEMPLATE?.NAME ?? row.NAME,
  },
  {
    header: T.State,
    id: 'state',
    accessorFn: (row) => getHostState(row)?.name,
    cell: ({ row }) => {
      const { color, name } = getHostState(row.original) ?? {}

      return <StatusTag statusColor={color} statusName={name} />
    },
  },
  {
    header: 'IM MAD',
    id: 'im_mad',
    accessorKey: 'IM_MAD',
  },
  {
    header: 'VM MAD',
    id: 'vm_mad',
    accessorKey: 'VM_MAD',
  },
  {
    header: T.RunningVMs,
    id: 'running_vms',
    accessorKey: 'HOST_SHARE.RUNNING_VMS',
  },
  {
    header: T.TotalVMs,
    id: 'TOTAL_VMS',
    accessorFn: (row) => getTotalOfResources(row?.VMS),
  },
  {
    header: T.CPU,
    id: 'cpu',
    accessorFn: (row) => getAllocatedInfo(row)?.percentCpuLabel,
  },
  {
    header: T.Memory,
    id: 'memory',
    accessorFn: (row) => getAllocatedInfo(row)?.percentMemLabel,
  },
  {
    header: T.Cluster,
    id: 'cluster',
    accessorKey: 'CLUSTER',
  },
  createLabelColumn(),
]

export const hostTable = createTable(HOST_COLUMNS, HostAPI.useGetHostsQuery, {
  dataCy: 'hosts',
})
