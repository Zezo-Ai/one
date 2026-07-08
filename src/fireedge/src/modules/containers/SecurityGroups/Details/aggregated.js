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

import { DetailsDrawer, InfoSlot, TabSlot, Button } from '@ComponentsV2Module'

import { useModalsApi, SecurityGroupAPI } from '@FeaturesModule'
import { Component } from 'react'

import { T, STYLE_BUTTONS } from '@ConstantsModule'
import { SecurityGroup } from '@ResourcesModule'

import { Box } from '@mui/material'
import PropTypes from 'prop-types'
import { Trash, Cancel as CloseIcon } from 'iconoir-react'

/**
 * @param {object} root0 - Params
 * @param {boolean} root0.isOpen - Is isOpen
 * @param {object} root0.selectedSecurityGroups - Selected Security Groups
 * @param {Function} root0.handleClose - Handle close
 * @param {Function} root0.handleSelect - Handle select
 * @param {Function} root0.handleDeselect - Handle deselect
 * @param {Array} root0.actions - Available actions
 * @returns {Component} - Single view details drawer
 */
export const AggregatedView = ({
  isOpen = false,
  selectedSecurityGroups = [],
  handleClose,
  handleSelect,
  handleDeselect,
  actions,
}) => {
  const { showModal } = useModalsApi()

  const [refreshSecGroup, { isFetching: isRefreshingSecGroup }] =
    SecurityGroupAPI.useLazyGetSecGroupQuery()

  const [remove, { isLoading: isRemoving }] =
    SecurityGroupAPI.useRemoveSecGroupMutation()

  const [changePermissions, { isLoading: isChangingPermissions }] =
    SecurityGroupAPI.useChangeSecGroupPermissionsMutation()
  const [changeOwnership, { isLoading: isChangingOwnership }] =
    SecurityGroupAPI.useChangeSecGroupOwnershipMutation()

  const handleRefresh = async () =>
    await Promise.all(
      selectedSecurityGroups.map(({ ID }) => refreshSecGroup({ id: ID }))
    )

  const handleChangePermission = async (newPermission) => {
    await Promise.all(
      selectedSecurityGroups.map(({ ID }) =>
        changePermissions({ id: ID, ...newPermission })
      )
    )
    await handleRefresh()
  }

  const handleChangeOwnership = async (newOwnership) => {
    await Promise.all(
      selectedSecurityGroups.map(({ ID }) =>
        changeOwnership({ id: ID, ...newOwnership })
      )
    )

    await handleRefresh()
  }

  const handleOpenDeleteForm = () =>
    showModal({
      isConfirmDialog: true,
      dialogProps: {
        title: `${T.Delete} ${T.SecurityGroup}`,
        description: T['securitygroup.delete.confirmation'],
      },
      onSubmit: async () => {
        await Promise.all(
          selectedSecurityGroups.map(({ ID }) => remove({ id: ID }))
        )
        handleClose()
      },
    })

  const isMutating =
    isRemoving ||
    isRefreshingSecGroup ||
    isChangingOwnership ||
    isChangingPermissions

  return (
    <DetailsDrawer
      isOpen={isOpen}
      slots={[
        [
          InfoSlot,
          {
            title: `${selectedSecurityGroups?.length} ${T.SecurityGroups}  ${T.Selected}`,
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

                <Button
                  type={STYLE_BUTTONS.TYPE.TRANSPARENT}
                  size="medium"
                  iconOnly={<CloseIcon width={'16px'} height={'16px'} />}
                  onClick={handleClose}
                />
              </Box>
            ),
          },
        ],
        [
          TabSlot,
          {
            tabs: SecurityGroup.Tabs.Aggregated,
            resourceId: SecurityGroup.RID,
            tabProps: {
              selected: selectedSecurityGroups,
              handleChangeOwnership,
              handleChangePermission,
              handleSelect,
              handleDeselect,
            },
          },
        ],
      ]}
    />
  )
}

AggregatedView.displayName = 'AggregatedView'

AggregatedView.propTypes = {
  isOpen: PropTypes.bool,
  selectedSecurityGroups: PropTypes.array,
  handleClose: PropTypes.func,
  handleSelect: PropTypes.func,
  handleDeselect: PropTypes.func,
  actions: PropTypes.array,
}
