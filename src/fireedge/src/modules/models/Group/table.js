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
/* eslint-disable jsdoc/require-jsdoc */

import { createTable, getTotalOfResources } from '@UtilsModule'
import { GroupAPI } from '@FeaturesModule'
import { T } from '@ConstantsModule'

export const GROUP_LIST_COLUMNS = [
  { accessorKey: 'ID', header: T.ID },
  { accessorKey: 'NAME', header: T.Name },
  {
    header: `${T.Total} ${T.Users}`,
    id: 'TOTAL_USERS',
    accessorFn: (row) => getTotalOfResources(row?.USERS),
  },
]
export const GROUP_COLUMNS = [
  ...GROUP_LIST_COLUMNS,
  { header: 'VM quota', accessorKey: 'VM_QUOTA' },
  { header: 'Datastore quota', accessorKey: 'DATASTORE_QUOTA' },
  { header: 'Network quota', accessorKey: 'NETWORK_QUOTA' },
  { header: 'Image quota', accessorKey: 'IMAGE_QUOTA' },
]

export const groupTable = createTable(GROUP_COLUMNS, GroupAPI.useGetGroupsQuery)
