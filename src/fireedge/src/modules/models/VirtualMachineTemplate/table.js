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
import { VmTemplateAPI } from '@FeaturesModule'
import { T, STATIC_FILES_URL, DEFAULT_TEMPLATE_LOGO } from '@ConstantsModule'
import { Image } from '@ComponentsV2Module'
import { createLabelColumn } from '@modules/models/labels'
import { Box } from '@mui/material'

/* eslint-disable jsdoc/require-jsdoc */
export const VMTEMPLATE_COLUMNS = [
  {
    accessorKey: 'ID',
    header: T.ID,
    width: '5%',
  },
  {
    accessorKey: 'NAME',
    header: T.Name,
    width: '30%',
    cell: ({ row }) => {
      const logo = row?.original?.TEMPLATE?.LOGO ?? DEFAULT_TEMPLATE_LOGO
      const src = `${STATIC_FILES_URL}/${logo}`

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Image
            src={src}
            width={32}
            height={32}
            alt={'list-image-identifier'}
          />
          <span>{row.original?.NAME}</span>
          {getLockIcon(row.original)}
        </Box>
      )
    },
  },
  {
    accessorKey: 'UNAME',
    header: T.Owner,
  },
  {
    accessorKey: 'GNAME',
    header: T.Group,
  },
  {
    accessorKey: 'REGTIME',
    header: T.RegistrationTime,
    cell: ({ row }) => timeFromMilliseconds(row.original.REGTIME).toRelative(),
  },
  createLabelColumn(),
]

export const vmtemplateTable = createTable(
  VMTEMPLATE_COLUMNS,
  VmTemplateAPI.useGetTemplatesQuery,
  { dataCy: 'vm-templates' }
)
