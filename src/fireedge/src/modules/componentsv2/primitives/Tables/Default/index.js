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
import { FilterPanel } from '@modules/componentsv2/composed/FilterPanel'
import { EmptyContent } from '@modules/componentsv2/composed/EmptyContent'
import {
  filterTableData,
  getTableFilterOptions,
  getTableSortOptions,
} from '@UtilsModule'
import { useResourceSingleViewContext, useTranslation } from '@ProvidersModule'

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
 * @param {boolean} props.openRowDetailsOnClick - Open row details drawer on click
 * @param {string} props.rowDetailsResourceId - Resource id used by row details drawer
 * @param {boolean} props.isEnableSearchBar - Whether to display the search input
 * @param {boolean} props.isEnableFilters - Whether to display the filters button
 * @param {boolean} props.isEnableSort - Whether to display the sort button
 * @param {string} props.searchPlaceholder - Search input placeholder
 * @param {Node} props.toolbar - Custom toolbar content
 * @param {Node} props.topRow - Custom row rendered above the table data
 * @param {object} props.emptyContentProps - Props forwarded to the empty content state
 * @param {boolean} props.isEmptyContentEnabled - Whether to display the empty content state
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
  openRowDetailsOnClick = false,
  rowDetailsResourceId,
  isEnableSearchBar = false,
  isEnableFilters = false,
  isEnableSort = false,
  searchPlaceholder,
  dataCy,
  toolbar,
  topRow,
  emptyContentProps,
  isEmptyContentEnabled = true,
  sx,
  ...props
}) => {
  const { translate } = useTranslation()
  const { openResourceSingleView } = useResourceSingleViewContext()
  const tableData = useMemo(() => [].concat(data ?? []).flat(), [data])
  const sortOptions = useMemo(() => getTableSortOptions(columns), [columns])
  const filterOptions = useMemo(
    () =>
      isEnableFilters ? getTableFilterOptions(tableData, true, columns) : [],
    [columns, isEnableFilters, tableData]
  )
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [filterValues, setFilterValues] = useState({})
  const [isFilterPanelOpen, setFilterPanelOpen] = useState(false)
  const filteredData = useMemo(
    () => filterTableData(tableData, filterValues, filterOptions),
    [filterOptions, filterValues, tableData]
  )

  const tableScrollRef = useRef(null)
  const theadRef = useRef(null)
  const footerRef = useRef(null)
  const [theadHeight, setTheadHeight] = useState(0)
  const [footerHeight, setFooterHeight] = useState(0)

  const { table } = initTable({
    data: filteredData,
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
  const isEmpty = !isLoading && tableRows.length === 0
  const tableColumns = table.getVisibleLeafColumns()
  const columnLayout = useMemo(() => {
    const styles = {}
    let minWidth = 0

    tableColumns.forEach((column) => {
      const { header, minWidth: definedMinWidth, width } = column.columnDef
      const headerText =
        typeof header === 'string' || typeof header === 'number'
          ? translate(String(header))
          : ''
      const parsedMinWidth =
        typeof definedMinWidth === 'number'
          ? definedMinWidth
          : Number(definedMinWidth?.match?.(/^(\d+(?:\.\d+)?)px$/)?.[1]) || 0
      const parsedWidth =
        typeof width === 'number'
          ? width
          : Number(width?.match?.(/^(\d+(?:\.\d+)?)px$/)?.[1]) || 0
      const columnMinWidth = Math.max(
        headerText ? 96 : 48,
        headerText ? headerText.length * 8 + 48 : 48,
        parsedMinWidth,
        parsedWidth
      )
      const cssMinWidth = `${columnMinWidth}px`
      const cssWidth = typeof width === 'number' ? `${width}px` : width

      minWidth += columnMinWidth
      styles[column.id] = {
        width: cssWidth ? `max(${cssWidth}, ${cssMinWidth})` : cssMinWidth,
        minWidth: cssMinWidth,
      }
    })

    return { minWidth, styles }
  }, [tableColumns, translate])

  // Recalculate measured heights only when layout depends on them.
  useLayoutEffect(() => {
    if (!isEmpty && !isFullHeight) return

    setTheadHeight(theadRef.current?.offsetHeight ?? 0)
    setFooterHeight(footerRef.current?.offsetHeight ?? 0)
  }, [
    isEmpty,
    isFullHeight,
    title,
    topRow,
    footer,
    pageSizeOptions,
    isDisablePagination,
  ])

  if (!tableData) return null

  const hasFilters = filterOptions.length > 0
  const hasSearchToolbar =
    !!onRefresh || isEnableSearchBar || hasFilters || isEnableSort
  const hasToolbar = hasSearchToolbar || !!toolbar

  const colCount = tableColumns.length
  const hasFooter = !!footer || !isDisablePagination
  const scrollTableHorizontally = (event, useVerticalDelta = false) => {
    const scrollElement = tableScrollRef.current
    if (
      !scrollElement ||
      scrollElement.scrollWidth <= scrollElement.clientWidth
    )
      return

    const verticalDelta = event.shiftKey || useVerticalDelta ? event.deltaY : 0
    const delta =
      Math.abs(event.deltaX) >= Math.abs(verticalDelta)
        ? event.deltaX
        : verticalDelta

    if (!delta) return

    const maxScrollLeft = scrollElement.scrollWidth - scrollElement.clientWidth
    const nextScrollLeft = Math.min(
      Math.max(scrollElement.scrollLeft + delta, 0),
      maxScrollLeft
    )

    scrollElement.scrollLeft = nextScrollLeft
    event.preventDefault()
    event.stopPropagation()
  }
  const emptyContentSize = emptyContentProps?.size

  const tableElement = (
    <Box className="table-container" sx={sx}>
      <Box
        ref={tableScrollRef}
        className="table-scroll"
        onWheel={(event) => scrollTableHorizontally(event)}
      >
        <Box
          component="table"
          aria-disabled={isDisabled}
          style={{ minWidth: `${columnLayout.minWidth}px` }}
        >
          <colgroup>
            {tableColumns.map((column) => (
              <col key={column.id} style={columnLayout.styles[column.id]} />
            ))}
          </colgroup>
          <thead ref={theadRef}>
            {title && (
              <tr className="table-title-row">
                <th colSpan={colCount} className="table-title">
                  {typeof title === 'string' ? translate(title) : title}
                </th>
              </tr>
            )}
            {topRow && (
              <tr className="table-top-row">
                <th colSpan={colCount}>{topRow}</th>
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
                      style={columnLayout.styles[header.column.id]}
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
                            : typeof header.column.columnDef.header === 'string'
                            ? translate(header.column.columnDef.header)
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
                    {tableColumns.map((column, colIndex) => (
                      <td key={colIndex} style={columnLayout.styles[column.id]}>
                        <div className="skeleton-cell" />
                      </td>
                    ))}
                  </tr>
                ))
              : tableRows.map((row) => (
                  <tr
                    key={row.id}
                    data-cy={dataCy ? `${dataCy}-${row.id}` : undefined}
                    onClick={() => {
                      if (isDisabled) return

                      if (
                        openRowDetailsOnClick &&
                        rowDetailsResourceId &&
                        openResourceSingleView(
                          rowDetailsResourceId,
                          row.original
                        )
                      ) {
                        return
                      }

                      if (!row.getCanSelect()) return

                      onRowClick
                        ? onRowClick(row.original)
                        : row.toggleSelected()
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
                          style={columnLayout.styles[cell.column.id]}
                        >
                          {cell.column.columnDef.meta?.disableCellTooltip ? (
                            body
                          ) : (
                            <Tooltip
                              title={cell.getValue?.() ?? ''}
                              followCursor
                            >
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
                <td colSpan={colCount} aria-hidden="true" />
              </tr>
            )}
            {isFullHeight && !isEmpty && (
              <tr className="filler-row">
                <td colSpan={colCount} />
              </tr>
            )}
          </tbody>
        </Box>
      </Box>

      {isEmpty && isEmptyContentEnabled && (
        <Box className="table-empty-content">
          <Box
            className="table-empty-content-inner"
            onWheel={(event) => scrollTableHorizontally(event, true)}
          >
            <EmptyContent {...emptyContentProps} />
          </Box>
        </Box>
      )}

      {hasFooter && (
        <Box ref={footerRef} className="table-footer">
          {footer && (
            <Box className="table-footer-item table-footer-content">
              {footer}
            </Box>
          )}
          {!isDisablePagination && (
            <Box className="table-footer-item table-pagination">
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
            </Box>
          )}
        </Box>
      )}
    </Box>
  )

  return (
    <Box
      data-cy={dataCy}
      sx={(theme) =>
        getStyles({
          theme,
          size,
          isDisabled,
          isLoading,
          emptyContentSize,
          theadHeight,
          footerHeight,
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
                isEnableFilters={hasFilters}
                isEnableSort={isEnableSort}
                isEnableView={false}
                searchPlaceholder={searchPlaceholder}
                searchDataCy={dataCy ? `search-${dataCy}` : undefined}
                refreshDataCy={dataCy ? 'refresh' : undefined}
                searchValue={globalFilter}
                sortOptions={sortOptions}
                sortValue={sorting}
                onSearchChange={setGlobalFilter}
                onSortChange={setSorting}
                onFilterClick={() => setFilterPanelOpen(true)}
              />
            </Box>
          )}
          {toolbar && <Box className="table-toolbar-custom">{toolbar}</Box>}
        </Box>
      )}
      {hasFilters && (
        <FilterPanel
          open={isFilterPanelOpen}
          filters={filterOptions}
          values={filterValues}
          onClose={() => setFilterPanelOpen(false)}
          onApply={setFilterValues}
        />
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
  openRowDetailsOnClick: PropTypes.bool,
  rowDetailsResourceId: PropTypes.string,
  isEnableSearchBar: PropTypes.bool,
  isEnableFilters: PropTypes.bool,
  isEnableSort: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  dataCy: PropTypes.string,
  toolbar: PropTypes.node,
  topRow: PropTypes.node,
  emptyContentProps: PropTypes.object,
  isEmptyContentEnabled: PropTypes.bool,
  footer: PropTypes.node,
  sx: PropTypes.object,
}
