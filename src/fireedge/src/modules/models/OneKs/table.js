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
import { OneKsAPI } from '@FeaturesModule'
import { T } from '@ConstantsModule'
import { StatusTag } from '@ComponentsV2Module'
import { getVirtualOneKsState } from '@modules/models/OneKs/general'
import { createLabelColumn } from '@modules/models/labels'

/* eslint-disable jsdoc/require-jsdoc */
export const ONEKS_COLUMNS = [
  { header: T.ID, id: 'id', accessorKey: 'ID', width: '10%' },
  { header: T.Name, id: 'name', accessorKey: 'NAME', width: '28%' },
  {
    header: T.State,
    id: 'state',
    width: '14%',
    accessorFn: (row) => getVirtualOneKsState(row)?.name,
    cell: ({ row }) => {
      const { color, name } = getVirtualOneKsState(row.original) ?? {}

      return <StatusTag statusColor={color} statusName={name} />
    },
  },
  {
    header: T.KubernetesVersion,
    id: 'version',
    width: '18%',
    accessorFn: (row) => row?.TEMPLATE?.CLUSTER_BODY?.kubernetes_version ?? '',
  },
  {
    header: T.NodeGroups,
    id: 'node_groups',
    accessorFn: (row) => row?.TEMPLATE?.CLUSTER_BODY?.node_groups?.length ?? 0,
  },
  {
    header: T.RegistrationTime,
    id: 'registration_time',
    width: '20%',
    accessorFn: (row) => row?.TEMPLATE?.CLUSTER_BODY?.registration_time ?? '',
  },
  createLabelColumn(),
]
export const oneksTable = createTable(
  ONEKS_COLUMNS,
  OneKsAPI.useGetOneKsClustersQuery,
  { dataCy: 'oneks' }
)
