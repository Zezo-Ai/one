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

import PropTypes from 'prop-types'
import { Component, useMemo } from 'react'
import { Button, TablePanel as SelectionTable } from '@ComponentsV2Module'
import { STYLE_BUTTONS, T } from '@ConstantsModule'
import { ArrowRight, Cancel as CloseIcon, Lock } from 'iconoir-react'
import { getBackupRunningVms, getImageState, getImageType } from '@ModelsModule'
import { prettyBytes } from '@UtilsModule'

/**
 * @param {object} root0 - Params
 * @param {object} root0.data - Tab specific data
 * @returns {Component} - Backup aggregated selection tab
 */
export const Selection = ({ data }) => {
  const { selected, handleSelect, handleDeselect } = data || {}
  const selectedBackups = useMemo(
    () => [].concat(selected).filter(Boolean),
    [selected]
  )
  const hasLockedItems = selectedBackups.some((backup) =>
    Object.hasOwn(backup ?? {}, 'LOCK')
  )

  const selectionColumns = useMemo(
    () =>
      [
        {
          id: 'deselect',
          header: '',
          width: '5%',
          cell: ({ row }) => (
            <Button
              type={STYLE_BUTTONS.TYPE.TRANSPARENT}
              size="small"
              iconOnly={<CloseIcon width={'16px'} height={'16px'} />}
              onClick={() => handleDeselect(row.original.ID)}
            />
          ),
        },
        hasLockedItems && {
          accessorKey: 'LOCK',
          header: '',
          width: '7%',
          cell: ({ row }) =>
            Object.hasOwn(row?.original ?? {}, 'LOCK') ? (
              <Lock width="20px" height="20px" />
            ) : null,
        },
        {
          accessorKey: 'NAME',
          id: 'name',
          header: T.Name,
          width: '22%',
        },
        {
          header: T.State,
          id: 'state',
          accessorFn: (row) => getImageState(row)?.name,
          width: '12%',
        },
        {
          header: T.Datastore,
          id: 'datastore',
          accessorKey: 'DATASTORE',
          width: '14%',
        },
        {
          header: T.Type,
          id: 'type',
          accessorFn: (row) => getImageType(row),
          width: '10%',
        },
        {
          header: T.Size,
          id: 'size',
          accessorFn: (row) => prettyBytes(+row?.SIZE || 0, 'MB'),
          width: '10%',
        },
        {
          header: T.VMs,
          id: 'vms',
          accessorFn: (row) => getBackupRunningVms(row),
          width: '8%',
        },
        {
          header: T.Owner,
          id: 'owner',
          accessorKey: 'UNAME',
          width: '9%',
        },
        {
          header: T.Group,
          id: 'group',
          accessorKey: 'GNAME',
          width: '9%',
        },
        {
          accessorKey: 'ID',
          header: '',
          width: '10%',
          cell: ({ row }) => (
            <Button
              type={STYLE_BUTTONS.TYPE.OUTLINE}
              size="small"
              endIcon={<ArrowRight width={'16px'} height={'16px'} />}
              onClick={() => handleSelect(row.original.ID)}
            >
              {T.View}
            </Button>
          ),
        },
      ].filter(Boolean),
    [handleDeselect, handleSelect, hasLockedItems]
  )

  return (
    <SelectionTable
      key="selected-backups-table"
      columns={selectionColumns}
      data={selectedBackups}
      isRowsSelectable={false}
      isEnableSearchBar={true}
      isEnableSort={true}
      isEnableFilters={true}
    />
  )
}

Selection.propTypes = {
  data: PropTypes.object,
}

Selection.id = 'info'
Selection.title = T.Selected

export default Selection
