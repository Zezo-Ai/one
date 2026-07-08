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
import { createTable, timeFromMilliseconds } from '@UtilsModule'
import { VnTemplateAPI } from '@FeaturesModule'
import { T } from '@ConstantsModule'
import { StatusTag, Tag } from '@ComponentsV2Module'
import { createLabelColumn } from '@modules/models/labels'

/* eslint-disable jsdoc/require-jsdoc */
export const VNTEMPLATE_COLUMNS = [
  { header: T.ID, id: 'id', accessorKey: 'ID', width: '5%' },
  { header: T.Name, id: 'name', accessorKey: 'NAME' },
  { header: T.Owner, id: 'owner', accessorKey: 'UNAME' },
  { header: T.Group, id: 'group', accessorKey: 'GNAME' },
  {
    header: T.Driver,
    id: 'driver',
    accessorFn: (row) => row?.TEMPLATE?.VN_MAD ?? '',
    cell: ({ row }) =>
      row.original?.TEMPLATE?.VN_MAD ? (
        <Tag title={row.original.TEMPLATE.VN_MAD} status="default" />
      ) : (
        '-'
      ),
  },
  {
    header: T.Locked,
    id: 'locked',
    accessorFn: (row) => (row?.LOCK ? T.Locked : ''),
    cell: ({ row }) =>
      row.original?.LOCK ? (
        <StatusTag statusColor="information" statusName={T.Locked} />
      ) : (
        '-'
      ),
  },
  {
    header: T.RegistrationTime,
    id: 'time',
    cell: ({ row }) =>
      row.original?.REGTIME
        ? timeFromMilliseconds(+row.original.REGTIME).toRelative()
        : '-',
  },
  createLabelColumn(),
]

export const vntemplateTable = createTable(
  VNTEMPLATE_COLUMNS,
  VnTemplateAPI.useGetVNTemplatesQuery
)
