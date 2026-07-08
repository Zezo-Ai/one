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

import { createTable, getImageType } from '@UtilsModule'
import { ImageAPI } from '@FeaturesModule'
import { getImageState } from '@modules/models/Image/general'
import { T } from '@ConstantsModule'
import { createLabelColumn } from '@modules/models/labels'

/* eslint-disable jsdoc/require-jsdoc */
export const IMAGE_COLUMNS = [
  {
    header: 'ID',
    id: 'id',
    accessorKey: 'ID',
    width: '10%',
  },
  {
    header: 'Name',
    id: 'name',
    accessorKey: 'NAME',
    width: '22%',
  },
  {
    header: 'Datastore',
    id: 'datastore',
    accessorKey: 'DATASTORE',
    width: '16%',
  },
  {
    header: 'Type',
    id: 'type',
    accessorFn: (row) => getImageType(row),
    width: '10%',
  },
  {
    header: 'State',
    id: 'state',
    accessorFn: (row) => getImageState(row)?.name,
    width: '12%',
  },
  {
    header: T.VMs,
    id: 'vms',
    accessorKey: 'RUNNING_VMS',
    width: '8%',
  },
  {
    header: 'Owner',
    id: 'owner',
    accessorKey: 'UNAME',
    width: '11%',
  },
  {
    header: T.Group,
    id: 'group',
    accessorKey: 'GNAME',
    width: '11%',
  },
  createLabelColumn(),
]

export const imageTable = createTable(IMAGE_COLUMNS, ImageAPI.useGetImagesQuery)
