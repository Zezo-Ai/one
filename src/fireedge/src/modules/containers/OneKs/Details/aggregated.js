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
  ButtonGroup,
  DetailsDrawer,
  InfoSlot,
  TabSlot,
} from '@ComponentsV2Module'

import { OneKsAPI, useModalsApi } from '@FeaturesModule'
import { Component } from 'react'

import { createActions, permissionsToOctal, toSnakeCase } from '@UtilsModule'

import { ONEKS_ACTIONS, STYLE_BUTTONS, T } from '@ConstantsModule'
import { Box } from '@mui/material'
import PropTypes from 'prop-types'
import { Cancel as CloseIcon, RefreshCircular, Trash } from 'iconoir-react'
import { OneKs as OneKsResource } from '@ResourcesModule'

const getPermissionOctet = (permissions = {}, newPermission = {}) => {
  const [key, value] = Object.entries(newPermission)[0] ?? []

  if (!key) return undefined

  const [member, permission] = toSnakeCase(key).toUpperCase().split('_')
  const fullPermissionName = `${member}_${permission?.[0]}`

  return permissionsToOctal({
    ...permissions,
    [fullPermissionName]: value,
  })
}

/**
 * @param {object} root0 - Params
 * @param {boolean} root0.isOpen - Is open
 * @param {object[]} root0.selectedData - Selected OneKs clusters
 * @param {Function} root0.handleClose - Handle close
 * @param {Function} root0.handleSelect - Handle select
 * @param {Function} root0.handleDeselect - Handle deselect
 * @param {object} root0.availableActions - Available actions
 * @returns {Component} - Aggregated view details drawer
 */
export const AggregatedView = ({
  isOpen = false,
  selectedData = [],
  handleClose,
  handleSelect,
  handleDeselect,
  availableActions = {},
}) => {
  const { showModal } = useModalsApi()

  const [refresh, { isFetching }] = OneKsAPI.useLazyGetOneKsClusterQuery()
  const [recover, { isLoading: isRecovering }] =
    OneKsAPI.useRecoverOneKsClusterMutation()
  const [remove, { isLoading: isRemoving }] =
    OneKsAPI.useDeleteOneKsClusterMutation()
  const [changePermissions, { isLoading: isChangingPermissions }] =
    OneKsAPI.useChangeOneKsClusterPermissionsMutation()
  const [changeOwnership, { isLoading: isChangingOwnership }] =
    OneKsAPI.useChangeOneKsClusterOwnershipMutation()

  const isMutating =
    isFetching ||
    isRecovering ||
    isRemoving ||
    isChangingPermissions ||
    isChangingOwnership

  const handleRefresh = async () =>
    await Promise.all(
      selectedData.map(({ ID }) => refresh({ id: ID, expand: true }))
    )

  const getConfirmationDescription = () =>
    `${selectedData.length} OneKs. ${T.DoYouWantProceed}`

  const handleConfirmAction = ({ title, onSubmit }) =>
    showModal({
      isConfirmDialog: true,
      dialogProps: {
        title,
        description: getConfirmationDescription(),
      },
      onSubmit,
    })

  const handleOpenRecoverForm = () =>
    handleConfirmAction({
      title: T.RecoverSeveralOneKsClusters,
      onSubmit: async () => {
        await Promise.all(selectedData.map(({ ID }) => recover({ id: ID })))
        await handleRefresh()
      },
    })

  const handleOpenDeleteForm = () =>
    showModal({
      name: T.Delete,
      dialogProps: {
        title: T.DeleteSelected,
        dataCy: 'modal-delete-oneks',
      },
      form: OneKsResource.Forms.DeleteOneKsClusterForm(),
      onSubmit: async (formData) => {
        await Promise.all(
          selectedData.map(({ ID }) =>
            remove({
              id: ID,
              ...(formData?.force ? { force: true } : {}),
            })
          )
        )
        handleClose()
      },
    })

  const handleChangePermission = async (newPermission) => {
    await Promise.all(
      selectedData.map(({ ID, PERMISSIONS }) => {
        const octet = getPermissionOctet(PERMISSIONS, newPermission)

        return octet ? changePermissions({ id: ID, octet }) : Promise.resolve()
      })
    )

    await handleRefresh()
  }

  const handleChangeOwnership = async (newOwnership) => {
    await Promise.all(
      selectedData.map(({ ID }) => changeOwnership({ id: ID, ...newOwnership }))
    )

    await handleRefresh()
  }

  const recoverButtons = createActions({
    filters: availableActions,
    actions: [
      {
        accessor: ONEKS_ACTIONS.RECOVER,
        startIcon: <RefreshCircular width="16px" height="16px" />,
        onClick: handleOpenRecoverForm,
        value: ONEKS_ACTIONS.RECOVER,
        isDisabled: isMutating,
        tooltip: T.Recover,
      },
    ],
  })

  const deleteButtons = createActions({
    filters: availableActions,
    actions: [
      {
        accessor: ONEKS_ACTIONS.DELETE,
      },
    ],
  })

  return (
    <DetailsDrawer
      isOpen={isOpen}
      slots={[
        [
          InfoSlot,
          {
            title: `${selectedData?.length} OneKs ${T.Selected}`,
            Toolbar: () => (
              <Box
                sx={(theme) => ({
                  display: 'flex',
                  flexDirection: 'row',
                  gap: `${theme.scale[500]}px`,
                })}
              >
                {recoverButtons.length > 0 && (
                  <ButtonGroup buttons={recoverButtons} />
                )}

                {deleteButtons.length > 0 && (
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
                )}

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
            tabs: OneKsResource.Tabs.Aggregated,
            resourceId: OneKsResource.RID,
            tabProps: {
              selected: selectedData,
              handleChangeOwnership,
              handleChangePermission,
              handleSelect,
              handleDeselect,
              isActionsDisabled: isMutating,
              isMutating,
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
  selectedData: PropTypes.array,
  handleClose: PropTypes.func,
  handleSelect: PropTypes.func,
  handleDeselect: PropTypes.func,
  availableActions: PropTypes.object,
}
