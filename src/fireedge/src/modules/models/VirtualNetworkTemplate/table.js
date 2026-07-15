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
import { createTable, getLockIcon, timeFromMilliseconds } from '@UtilsModule'
import { VnTemplateAPI } from '@FeaturesModule'
import { T } from '@ConstantsModule'
import { Tag } from '@ComponentsV2Module'
import { createLabelColumn } from '@modules/models/labels'
import { Box } from '@mui/material'

/* eslint-disable jsdoc/require-jsdoc */
export const VNTEMPLATE_COLUMNS = [
  { header: T.ID, id: 'id', accessorKey: 'ID', width: '5%' },
  {
    header: T.Name,
    id: 'name',
    accessorKey: 'NAME',
    cell: ({ row }) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>{row.original?.NAME}</span>
        {getLockIcon(row.original)}
      </Box>
    ),
  },
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
  { header: T.Owner, id: 'owner', accessorKey: 'UNAME' },
  { header: T.Group, id: 'group', accessorKey: 'GNAME' },
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
  VnTemplateAPI.useGetVNTemplatesQuery,
  { dataCy: 'vnet-templates' }
)
