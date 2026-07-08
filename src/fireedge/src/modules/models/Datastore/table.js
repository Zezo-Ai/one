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
import {
  getDatastoreState,
  getDatastoreType,
  getDatastoreCapacityInfo,
} from '@modules/models/Datastore/general'
import { createTable } from '@UtilsModule'
import { DatastoreAPI } from '@FeaturesModule'
import { createLabelColumn } from '@modules/models/labels'

/* eslint-disable jsdoc/require-jsdoc */
export const DATASTORE_COLUMNS = [
  {
    header: T.ID,
    id: 'id',
    width: '10%',
    accessorKey: 'ID',
  },
  {
    header: T.Name,
    id: 'name',
    width: '22%',
    accessorKey: 'NAME',
  },
  {
    header: T.State,
    id: 'state',
    width: '12%',
    accessorFn: (row) => getDatastoreState(row)?.name,
  },
  {
    header: T.Capacity,
    id: 'capacity',
    width: '14%',
    accessorFn: (row) => {
      const capacity = getDatastoreCapacityInfo(row)

      return capacity.percentLabel
    },
  },
  {
    header: T.Type,
    id: 'type',
    width: '12%',
    accessorFn: (row) => getDatastoreType(row),
  },
  {
    header: T.Clusters,
    id: 'clusters',
    width: '10%',
    accessorFn: (row) => [row?.CLUSTERS?.ID ?? []].flat(),
  },
  {
    header: T.Owner,
    id: 'owner',
    width: '10%',
    accessorKey: 'UNAME',
  },
  {
    header: T.Group,
    id: 'group',
    width: '10%',
    accessorKey: 'GNAME',
  },
  createLabelColumn(),
]

export const datastoreTable = createTable(
  DATASTORE_COLUMNS,
  DatastoreAPI.useGetDatastoresQuery
)
