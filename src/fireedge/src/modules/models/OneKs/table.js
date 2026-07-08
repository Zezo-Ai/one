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
import { OneKsAPI } from '@FeaturesModule'

/* eslint-disable jsdoc/require-jsdoc */
export const ONEKS_COLUMNS = [
  { header: 'ID', id: 'id', accessorKey: 'ID', width: '10%' },
  { header: 'Name', id: 'name', accessorKey: 'NAME', width: '28%' },
  {
    header: 'State',
    id: 'STATE',
    width: '14%',
    /**
     * @param {object} row - row data
     * @returns {string} Cluster state
     */
    accessorFn: (row) => row?.TEMPLATE?.CLUSTER_BODY?.state ?? '',
  },
  {
    header: 'Version',
    id: 'VERSION',
    width: '18%',
    /**
     * @param {object} row - row data
     * @returns {string} Kubernetes version
     */
    accessorFn: (row) => row?.TEMPLATE?.CLUSTER_BODY?.kubernetes_version ?? '',
  },
  {
    header: 'Created',
    id: 'CREATED',
    width: '20%',
    /**
     * @param {object} row - row data
     * @returns {string} Cluster creation time
     */
    accessorFn: (row) => row?.TEMPLATE?.CLUSTER_BODY?.registration_time ?? '',
  },
]
export const oneksTable = createTable(
  ONEKS_COLUMNS,
  OneKsAPI.useGetOneKsClustersQuery
)
