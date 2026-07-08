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
import { UserAPI } from '@FeaturesModule'
import { T } from '@ConstantsModule'

/* eslint-disable jsdoc/require-jsdoc */
export const USER_COLUMNS = [
  { header: 'ID', accessorKey: 'ID' },
  { header: 'Name', accessorKey: 'NAME' },
  { header: 'Group', accessorKey: 'GNAME' },
  { header: 'GroupAdmin', accessorKey: 'IS_ADMIN_GROUP' },
  { header: 'Enabled', accessorKey: 'ENABLED' },
  { header: 'Auth driver', accessorKey: 'AUTH_DRIVER' },
  { header: 'VM quota', accessorKey: 'VM_QUOTA' },
  { header: 'Datastore quota', accessorKey: 'DATASTORE_QUOTA' },
  { header: 'Network quota', accessorKey: 'NETWORK_QUOTA' },
  { header: 'Image quota', accessorKey: 'IMAGE_QUOTA' },
]

export const USER_LIST_COLUMNS = [
  { accessorKey: 'ID', header: T.ID },
  { accessorKey: 'NAME', header: T.Name },
  { accessorKey: 'GNAME', header: T.Group },
  { accessorKey: 'AUTH_DRIVER', header: T.AuthDriver },
]

export const userTable = createTable(USER_COLUMNS, UserAPI.useGetUsersQuery)
