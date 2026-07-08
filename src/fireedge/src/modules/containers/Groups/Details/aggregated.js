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

import {
  Button,
  DetailsDrawer,
  InfoSlot,
  SummarySlot,
  TabSlot,
  ToggleGroup,
} from '@ComponentsV2Module'
import { STYLE_BUTTONS, T } from '@ConstantsModule'
import { GroupAPI, useModalsApi } from '@FeaturesModule'
import { Group } from '@ResourcesModule'
import { getTotalOfResources } from '@UtilsModule'
import { Box } from '@mui/material'
import { Cancel, RefreshDouble, Trash } from 'iconoir-react'
import PropTypes from 'prop-types'
import { Component, useMemo } from 'react'

/**
 * @param {object} root0 - Params
 * @param {boolean} root0.isOpen - Is open
 * @param {Array} root0.selectedGroups - Selected groups
 * @param {Function} root0.handleClose - Handle close
 * @returns {Component} - Aggregated view details drawer
 */
export const AggregatedView = ({
  isOpen = false,
  selectedGroups = [],
  handleClose,
}) => {
  const { showModal } = useModalsApi()
  const [refreshGroup, { isFetching }] = GroupAPI.useLazyGetGroupQuery()
  const [remove, { isLoading: isRemoving }] = GroupAPI.useRemoveGroupMutation()

  const handleRefresh = async () =>
    await Promise.all(selectedGroups.map(({ ID }) => refreshGroup({ id: ID })))

  const handleOpenDeleteForm = () =>
    showModal({
      isConfirmDialog: true,
      dialogProps: {
        title: [T.Delete, T.Groups].filter(Boolean).join(' '),
        description: T.DoYouWantProceed,
        confirmLabel: T.Delete,
      },
      onSubmit: async () => {
        await Promise.all(selectedGroups.map(({ ID }) => remove({ id: ID })))
        handleClose()
      },
    })

  const totalUsers = useMemo(
    () =>
      selectedGroups.reduce(
        (total, group) => total + getTotalOfResources(group?.USERS),
        0
      ),
    [selectedGroups]
  )

  const isMutating = isFetching || isRemoving

  return (
    <DetailsDrawer
      isOpen={isOpen}
      slots={[
        [
          InfoSlot,
          {
            title: `${selectedGroups?.length} ${T.Groups} ${T.Selected}`,
            Toolbar: () => (
              <Box
                sx={(theme) => ({
                  display: 'flex',
                  flexDirection: 'row',
                  gap: `${theme.scale[500]}px`,
                })}
              >
                <Button
                  type={STYLE_BUTTONS.TYPE.PRIMARY}
                  size="small"
                  startIcon={<Trash width={'16px'} height={'16px'} />}
                  onClick={handleOpenDeleteForm}
                  isDestructive
                  isDisabled={isMutating}
                >
                  {T.DeleteSelected}
                </Button>

                <ToggleGroup
                  size="medium"
                  options={[
                    [
                      {
                        startIcon: <RefreshDouble width="16px" height="16px" />,
                        onClick: handleRefresh,
                        value: 'refresh',
                        isDisabled: isMutating,
                      },
                      {
                        startIcon: <Cancel width="16px" height="16px" />,
                        onClick: handleClose,
                        value: 'close',
                      },
                    ],
                  ]}
                />
              </Box>
            ),
          },
        ],
        [
          SummarySlot,
          {
            labels: [
              [selectedGroups?.length, T.Groups],
              [totalUsers, T.Users],
            ],
          },
        ],
        [
          TabSlot,
          {
            tabs: Group.Tabs.Aggregated,
            resourceId: Group.RID,
            tabProps: {
              selected: selectedGroups,
            },
          },
          { flex: '1 1 0', minHeight: 0 },
        ],
      ]}
    />
  )
}

AggregatedView.displayName = 'AggregatedView'

AggregatedView.propTypes = {
  isOpen: PropTypes.bool,
  selectedGroups: PropTypes.array,
  handleClose: PropTypes.func,
}
