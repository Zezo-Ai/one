/* ------------------------------------------------------------------------- *
 * Copyright 2002-2025, OpenNebula Project, OpenNebula Systems               *
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
import { useMemo, ReactElement } from 'react'
import WrapperRow from '@modules/components/Tables/Enhanced/WrapperRow'

import { useViews, VnTemplateAPI } from '@FeaturesModule'

import EnhancedTable, {
  createColumns,
} from '@modules/components/Tables/Enhanced'
import VNetworkTemplateColumns from '@modules/components/Tables/VnTemplates/columns'
import VNetworkTemplateRow from '@modules/components/Tables/VnTemplates/row'
import { RESOURCE_NAMES, T } from '@ConstantsModule'

const DEFAULT_DATA_CY = 'vnet-templates'

/**
 * @param {object} props - Props
 * @returns {ReactElement} Virtual Network Templates table
 */
const VnTemplatesTable = (props) => {
  const { rootProps = {}, searchProps = {}, ...rest } = props ?? {}
  rootProps['data-cy'] ??= DEFAULT_DATA_CY
  searchProps['data-cy'] ??= `search-${DEFAULT_DATA_CY}`

  const { view, getResourceView } = useViews()
  const {
    data = [],
    isFetching,
    refetch,
  } = VnTemplateAPI.useGetVNTemplatesQuery()

  const columns = useMemo(
    () =>
      createColumns({
        filters: getResourceView(RESOURCE_NAMES.VN_TEMPLATE)?.filters,
        columns: VNetworkTemplateColumns,
      }),
    [view]
  )

  const listHeader = [
    { header: T.ID, id: 'id', accessor: 'ID' },
    { header: T.Name, id: 'name', accessor: 'NAME' },
    { header: T.Owner, id: 'owner', accessor: 'UNAME' },
    { header: T.Group, id: 'group', accessor: 'GNAME' },
  ]

  const { component, header } = WrapperRow(VNetworkTemplateRow)

  return (
    <EnhancedTable
      columns={columns}
      data={useMemo(() => data, [data])}
      rootProps={rootProps}
      searchProps={searchProps}
      refetch={refetch}
      isLoading={isFetching}
      getRowId={(row) => String(row.ID)}
      RowComponent={component}
      headerList={header && listHeader}
      resourceType={RESOURCE_NAMES.VN_TEMPLATE}
      {...rest}
    />
  )
}

VnTemplatesTable.propTypes = { ...EnhancedTable.propTypes }
VnTemplatesTable.displayName = 'VnTemplatesTable'

export default VnTemplatesTable
