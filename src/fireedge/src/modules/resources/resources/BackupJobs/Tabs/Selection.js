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

/**
 * @param {object} root0 - Params
 * @param {object} root0.data - Tab specific data
 * @returns {Component} - BackupJob aggregated selection tab
 */
export const Selection = ({ data }) => {
  const { selected, handleSelect, handleDeselect } = data || {}
  const selectedBackupJobs = useMemo(
    () => [].concat(selected).filter(Boolean),
    [selected]
  )
  const hasLockedItems = selectedBackupJobs.some((backupjob) =>
    Object.hasOwn(backupjob ?? {}, 'LOCK')
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
          width: '28%',
        },
        {
          header: T.Priority,
          id: 'priority',
          accessorKey: 'PRIORITY',
          width: '12%',
        },
        {
          header: T.Owner,
          id: 'owner',
          accessorKey: 'UNAME',
          width: '15%',
        },
        {
          header: T.Group,
          id: 'group',
          accessorKey: 'GNAME',
          width: '15%',
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
      key="selected-backupjobs-table"
      columns={selectionColumns}
      data={selectedBackupJobs}
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
