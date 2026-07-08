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
import { ServiceTemplateAPI } from '@FeaturesModule'
import { T } from '@ConstantsModule'
import { createLabelColumn } from '@modules/models/labels'

/* eslint-disable jsdoc/require-jsdoc */
export const SERVICETEMPLATES_COLUMNS = [
  { header: T.ID, id: 'id', accessorKey: 'ID', width: '5%' },
  { header: T.Name, id: 'name', accessorKey: 'NAME' },
  {
    header: T.RegistrationTime,
    id: 'time',
    accessorKey: 'TEMPLATE.BODY.registration_time',
    cell: ({ row }) =>
      timeFromMilliseconds(
        row.original?.TEMPLATE?.BODY?.registration_time
      ).toRelative(),
  },
  { header: T.Owner, id: 'owner', accessorKey: 'UNAME' },
  { header: T.Group, id: 'group', accessorKey: 'GNAME' },
  createLabelColumn(),
]

export const SERVICETEMPLATES_ROLES_COLUMNS = [
  { header: T.Name, id: 'name', accessorKey: 'name' },
  {
    header: T.Cardinality,
    id: 'cardinality',
    accessorKey: 'cardinality',
    width: '10%',
  },
  { header: T.Min, id: 'min_vms', accessorKey: 'min_vms', width: '5%' },
  { header: T.Max, id: 'max_vms', accessorKey: 'max_vms', width: '5%' },
]

export const servicetemplateTable = createTable(
  SERVICETEMPLATES_COLUMNS,
  ServiceTemplateAPI.useGetServiceTemplatesQuery
)
