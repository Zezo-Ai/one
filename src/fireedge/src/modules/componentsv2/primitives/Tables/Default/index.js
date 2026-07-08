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

import { useMemo, useLayoutEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { flexRender } from '@tanstack/react-table'
import { Box } from '@mui/material'
import { getStyles } from '@modules/componentsv2/primitives/Tables/Default/styles'
import { initTable } from '@modules/componentsv2/primitives/Tables/Default/internal'
import { Pagination } from '@modules/componentsv2/primitives/Pagination/Default'
import { Tooltip } from '@modules/componentsv2/primitives/Tooltip/Default'
import { SearchBar } from '@modules/componentsv2/composed/SearchBar'
import { EmptyContent } from '@modules/componentsv2/composed/EmptyContent'
import { getTableSortOptions } from '@UtilsModule'

/**
 * @param {object} props - Table props and data
 * @param {Array<object>} props.data - The data rows to display.
 * @param {Array<object>} props.columns - Column definitions.
 * @param {string} props.columns[].accessorKey - The key used to access column data from each row.
 * @param {string} props.columns[].header - The header label or React node.
 * @param {string} [props.columns[].width] - Column width (e.g., '40%').
 * - A column element with explicit width sets the width for that column.
 * - Otherwise, a cell in the first row with explicit width determines the width for that column.
 * - Otherwise, the column gets the width from the shared remaining horizontal space.
 * @param {boolean} [props.isCopyColumn=true] - Whether to include a checkbox copy column at the start.
 * @param {'small'|'medium'|'large'} [props.size='small'] - Size variant of the table.
 * @param {boolean} [props.isRowsSelectable=true] - Whether to enable selecting rows.
 * @param {boolean} [props.isMultiRowSelection=true] - Whether to enable selecting multiple rows at once.
 * @param {string} props.title - Table header title
 * @param {boolean} props.isDisabled - Disable interactions
 * @param {boolean} props.isDisablePagination - Disable pagination selector
 * @param {boolean} props.isLoading - Display loading state
 * @param {number} props.skeletonRows - Number of skeleton loading rows to display. Ideally should match the table row length.
 * @param {object} props.rowSelection - External controlled row selection state
 * @param {Function} props.onRowSelectionChange - On change handler for row selection change
 * @param {Function} props.onRowClick - Override row click handler
 * @param {Function} props.getRowId - Row ID handler
 * @param {number} props.defaultPageSize - Initial/Default page size to use
 * @param {Array} props.pageSizeOptions - Array of page size options to use
 * @param {Function} props.onRefresh - Refresh handler
 * @param {boolean} props.isRefreshing - Disable refresh while refreshing
 * @param {boolean} props.isEnableSearchBar - Whether to display the search input
 * @param {boolean} props.isEnableFilters - Whether to display the filters button
 * @param {boolean} props.isEnableSort - Whether to display the sort button
 * @param {string} props.searchPlaceholder - Search input placeholder
 * @param {Node} props.toolbar - Custom toolbar content
 * @param {object} props.emptyContentProps - Props forwarded to the empty content state
 * @param {Node} props.footer - Footer component
 * @param {boolean} props.isFullHeight - Adds a filler row to table to extend tbody to 100% height.
 * @param {object} props.sx - SX override
 * @returns {Element} The rendered table component.
 */
export const Table = ({
  data,
  columns,
  title,
  footer,
  rowSelection,
  onRowSelectionChange,
  onRowClick,
  getRowId,
  isCopyColumn = false,
  size = 'small',
  isRowsSelectable = false,
  isMultiRowSelection = false,
  isDisabled = false,
  isDisablePagination = false,
  isFullHeight = false,
  isLoading = false,
  skeletonRows = 5,
  defaultPageSize,
  pageSizeOptions,
  onRefresh,
  isRefreshing,
  isEnableSearchBar = false,
  isEnableFilters = false,
  isEnableSort = false,
  searchPlaceholder,
  toolbar,
  emptyContentProps,
  sx,
  ...props
}) => {
  const tableData = useMemo(() => [].concat(data ?? []).flat(), [data])
  const sortOptions = useMemo(() => getTableSortOptions(columns), [columns])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])

  const theadRef = useRef(null)
  const tfootRef = useRef(null)
  const [theadHeight, setTheadHeight] = useState(0)
  const [tfootHeight, setTfootHeight] = useState(0)

  const { table } = initTable({
    data: tableData,
    columns,
    isCopyColumn,
    enableRowSelection: isRowsSelectable,
    enableMultiRowSelection: isMultiRowSelection,
    rowSelection,
    onRowSelectionChange,
    getRowId,
    defaultPageSize,
    globalFilter,
    onGlobalFilterChange: setGlobalFilter,
    sorting,
    onSortingChange: setSorting,
  })

  const tableRows = table.getRowModel().rows
  const visibleRowCount = tableRows.length
  const isEmpty = !isLoading && tableRows.length === 0

  // Recalculate header/footer height for the filler row. Keyed off the actual
  // rendered row count so search/sort/pagination changes are reflected.
  useLayoutEffect(() => {
    if (!isFullHeight) return

    setTheadHeight(theadRef.current?.offsetHeight ?? 0)
    setTfootHeight(tfootRef.current?.offsetHeight ?? 0)
  }, [visibleRowCount, isLoading, title, pageSizeOptions, isFullHeight])

  if (!tableData) return null

  const hasSearchToolbar =
    !!onRefresh || isEnableSearchBar || isEnableFilters || isEnableSort
  const hasToolbar = hasSearchToolbar || !!toolbar

  const colCount = table.getAllColumns().length

  const tableElement = (
    <Box className="table-container" sx={sx}>
      <Box component="table" aria-disabled={isDisabled}>
        <thead ref={theadRef}>
          {title && (
            <tr className="table-title-row">
              <th colSpan={colCount} className="table-title">
                {title}
              </th>
            </tr>
          )}
          {table.getHeaderGroups().map((headerGroup) => {
            const hasHeaders = headerGroup.headers.some(
              (header) => header.column.columnDef.header
            )
            if (!hasHeaders) return null

            return (
              <tr key={headerGroup.id} className="table-header-row">
                {headerGroup.headers.map((header) => (
                  <th
                    colSpan={header.colSpan}
                    key={header.id}
                    style={{
                      width: header.column.columnDef.width || 'auto',
                      minWidth: header.column.columnDef.minWidth || 0,
                    }}
                  >
                    <Tooltip
                      title={
                        header.column.columnDef.meta?.disableHeaderTooltip
                          ? ''
                          : header.column.columnDef.header ?? ''
                      }
                    >
                      <div className="text-ellipsis">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </div>
                    </Tooltip>
                  </th>
                ))}
              </tr>
            )
          })}
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {table.getAllColumns().map((column, colIndex) => (
                    <td key={colIndex}>
                      <div className="skeleton-cell" />
                    </td>
                  ))}
                </tr>
              ))
            : tableRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => {
                    if (isDisabled || !row.getCanSelect()) return
                    onRowClick ? onRowClick(row.original) : row.toggleSelected()
                  }}
                  className={row.getIsSelected() ? 'selected' : ''}
                >
                  {row.getVisibleCells().map((cell) => {
                    const body = (
                      <div className="text-ellipsis">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    )

                    return (
                      <td
                        key={cell.id}
                        style={{ width: cell.column.columnDef.width || 'auto' }}
                      >
                        {cell.column.columnDef.meta?.disableCellTooltip ? (
                          body
                        ) : (
                          <Tooltip title={cell.getValue?.() ?? ''} followCursor>
                            {body}
                          </Tooltip>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
          {isEmpty && (
            <tr className="table-empty-row">
              <td colSpan={colCount}>
                <EmptyContent {...emptyContentProps} />
              </td>
            </tr>
          )}
          {isFullHeight && !isEmpty && (
            <tr className="filler-row">
              <td colSpan={colCount} />
            </tr>
          )}
        </tbody>

        <tfoot ref={tfootRef}>
          {footer && (
            <tr>
              <td colSpan={colCount}>{footer}</td>
            </tr>
          )}
          {!isDisablePagination && (
            <tr>
              <td colSpan={colCount}>
                <Pagination
                  pageIndex={table.getState().pagination.pageIndex}
                  pageCount={table.getPageCount()}
                  onPageChange={(next) => table.setPageIndex(next)}
                  cutoffRange={1}
                  pageSize={table.getState().pagination.pageSize}
                  paginationSizes={pageSizeOptions}
                  onPageSizeChange={(value) => table.setPageSize(Number(value))}
                  isPageSizeController
                />
              </td>
            </tr>
          )}
        </tfoot>
      </Box>
    </Box>
  )

  return (
    <Box
      sx={(theme) =>
        getStyles({
          theme,
          size,
          isDisabled,
          isLoading,
          theadHeight,
          tfootHeight,
          isFullHeight,
          ...props,
        })
      }
    >
      {hasToolbar && (
        <Box className="table-toolbar">
          {hasSearchToolbar && (
            <Box className="table-toolbar-search">
              <SearchBar
                onRefresh={onRefresh}
                isRefreshing={isRefreshing}
                isEnableSearchBar={isEnableSearchBar}
                isEnableFilters={isEnableFilters}
                isEnableSort={isEnableSort}
                isEnableView={false}
                searchPlaceholder={searchPlaceholder}
                searchValue={globalFilter}
                sortOptions={sortOptions}
                sortValue={sorting}
                onSearchChange={setGlobalFilter}
                onSortChange={setSorting}
              />
            </Box>
          )}
          {toolbar && <Box className="table-toolbar-custom">{toolbar}</Box>}
        </Box>
      )}
      {tableElement}
    </Box>
  )
}

Table.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
  columns: PropTypes.array,
  title: PropTypes.string,
  isCopyColumn: PropTypes.bool,
  size: PropTypes.string,
  rowSelection: PropTypes.object,
  onRowSelectionChange: PropTypes.func,
  onRowClick: PropTypes.func,
  getRowId: PropTypes.func,
  isMultiRowSelection: PropTypes.bool,
  isRowsSelectable: PropTypes.bool,
  isDisablePagination: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isFullHeight: PropTypes.bool,
  skeletonRows: PropTypes.number,
  defaultPageSize: PropTypes.number,
  pageSizeOptions: PropTypes.array,
  onRefresh: PropTypes.func,
  isRefreshing: PropTypes.bool,
  isEnableSearchBar: PropTypes.bool,
  isEnableFilters: PropTypes.bool,
  isEnableSort: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  toolbar: PropTypes.node,
  emptyContentProps: PropTypes.object,
  footer: PropTypes.node,
  sx: PropTypes.object,
}
