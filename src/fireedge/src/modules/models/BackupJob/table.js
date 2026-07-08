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

import { T } from '@ConstantsModule'
import { BackupJobAPI } from '@FeaturesModule'
import { createTable } from '@UtilsModule'
import {
  getBackupJobLastBackupTime,
  getBackupJobState,
} from '@modules/models/BackupJob/general'
import { createLabelColumn } from '@modules/models/labels'

/* eslint-disable jsdoc/require-jsdoc */
export const BACKUPJOB_COLUMNS = [
  {
    header: T.ID,
    id: 'id',
    accessorKey: 'ID',
  },
  {
    header: T.Name,
    id: 'name',
    accessorKey: 'NAME',
  },
  {
    header: T.State,
    id: 'state',
    accessorFn: (row) => getBackupJobState(row),
  },
  {
    header: T.Priority,
    id: 'priority',
    accessorKey: 'PRIORITY',
  },
  {
    header: T.LastBackupTimeInfo,
    id: 'lastBackupTime',
    accessorFn: (row) => getBackupJobLastBackupTime(row?.LAST_BACKUP_TIME),
  },
  {
    header: T.Owner,
    id: 'owner',
    accessorKey: 'UNAME',
  },
  {
    header: T.Group,
    id: 'group',
    accessorKey: 'GNAME',
  },
  createLabelColumn(),
]

export const backupJobTable = createTable(
  BACKUPJOB_COLUMNS,
  BackupJobAPI.useGetBackupJobsQuery
)
