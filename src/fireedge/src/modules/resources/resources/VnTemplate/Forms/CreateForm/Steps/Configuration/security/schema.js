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
import { array, object, ObjectSchema, string } from 'yup'

import { SecurityGroupAPI } from '@FeaturesModule'
import { INPUT_TYPES, T } from '@ConstantsModule'
import { createTable, Field, getValidationFromFields } from '@UtilsModule'

export const TAB_ID = 'SECURITY_GROUPS'

const getRulesCount = (securityGroup) =>
  [securityGroup?.TEMPLATE?.RULE ?? []].flat().filter(Boolean).length

const SECURITY_GROUP_COLUMNS = [
  { accessorKey: 'ID', header: T.ID, width: '7%' },
  { accessorKey: 'NAME', header: T.Name, width: '30%' },
  { accessorKey: 'UNAME', header: T.Owner },
  { accessorKey: 'GNAME', header: T.Group },
  {
    id: 'rules',
    header: T.Rules,
    accessorFn: getRulesCount,
  },
]

const securityGroupTemplateTable = createTable(
  SECURITY_GROUP_COLUMNS,
  SecurityGroupAPI.useGetSecGroupsQuery
)

/** @type {Field} Security groups field */
const SECURITY_GROUPS = (readOnly) => ({
  name: TAB_ID,
  label: T.SecurityGroups,
  type: INPUT_TYPES.TABLE,
  model: securityGroupTemplateTable,
  singleSelect: false,
  selectOnRowClick: true,
  readOnly,
  validation: array(string().trim())
    .ensure()
    .default(() => []),
  fieldProps: {
    isEnableSearchBar: true,
    isEnableSort: true,
    isEnableFilters: true,
    defaultPageSize: 5,
    pageSizeOptions: [5, 10, 20],
    isCopyColumn: true,
    size: 'medium',
  },
  grid: { md: 12 },
})

/** @type {Field[]} Security groups fields */
export const FIELDS = (readOnly = false) => [SECURITY_GROUPS(readOnly)]

/** @type {ObjectSchema} Security groups schema */
export const SCHEMA = object(getValidationFromFields(FIELDS()))
