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
  DetailsDrawer,
  InfoSlot,
  SummarySlot,
  TabSlot,
  ToggleGroup,
} from '@ComponentsV2Module'
import { unset } from 'lodash'

import { Box, useTheme } from '@mui/material'
import { Component, useMemo } from 'react'
import PropTypes from 'prop-types'
import { RefreshCircular, RefreshDouble, Trash, Cancel } from 'iconoir-react'
import { IMAGE_ACTIONS, T } from '@ConstantsModule'
import { cloneObject, createActions, jsonToXml, set } from '@UtilsModule'
import { ImageAPI, useModalsApi } from '@FeaturesModule'
import { Backups as BackupsResource } from '@ResourcesModule'
import {
  getBackupDiskIds,
  getBackupIncrements,
  getBackupRestoreOptions,
  getBackupVmIds,
  getImageType,
} from '@ModelsModule'

const getRestoreFormConfig = (backup = {}) => {
  const increments = getBackupIncrements(backup)
  const backupDiskIds = getBackupDiskIds(backup)
  const vmsId = getBackupVmIds(backup)

  return {
    steps: BackupsResource.Forms.RestoreForm,
    stepProps: {
      increments,
      backupDiskIds,
      vmsId,
      disableImageSelection: true,
    },
    initialValues: {
      increments,
      backupDiskIds,
    },
  }
}

/**
 * @param {object} root0 - Params
 * @param {boolean} root0.isOpen - Is isOpen
 * @param {object} root0.selectedData - Selected backup
 * @param {object} root0.availableActions - Available actions
 * @param {Function} root0.handleClose - Handle close
 * @returns {Component} - Single view details drawer
 */
export const SingleView = ({
  isOpen = false,
  selectedData = {},
  handleClose,
  availableActions = {},
}) => {
  const { palette } = useTheme()
  const { showModal } = useModalsApi()

  const [refresh, { data: refreshedData = {}, isFetching }] =
    ImageAPI.useLazyGetImageQuery()
  const [restore, { isLoading: isRestoring }] =
    ImageAPI.useRestoreBackupMutation()
  const [deleteImage, { isLoading: isDeleting }] =
    ImageAPI.useRemoveImageMutation()
  const [rename, { isLoading: isRenaming }] = ImageAPI.useRenameImageMutation()
  const [update, { isLoading: isUpdatingImage }] =
    ImageAPI.useUpdateImageMutation()
  const [changePermissions, { isLoading: isChangingPermissions }] =
    ImageAPI.useChangeImagePermissionsMutation()
  const [changeOwnership, { isLoading: isChangingOwnership }] =
    ImageAPI.useChangeImageOwnershipMutation()

  const data =
    String(refreshedData?.ID) === String(selectedData?.ID)
      ? refreshedData
      : selectedData
  const { ID, TEMPLATE } = data

  const type = useMemo(() => getImageType(data), [data])
  const { DATASTORE, PERSISTENT } = data

  const modalLabel = `#${ID} ${data?.NAME}`.trim()
  const backupIsLocked = data?.LOCK != null

  const isActionsDisabled =
    ID === undefined ||
    isFetching ||
    isRestoring ||
    isDeleting ||
    isRenaming ||
    isUpdatingImage ||
    isChangingPermissions ||
    isChangingOwnership

  const handleRefresh = () => ID !== undefined && refresh({ id: ID })

  const refreshCurrentData = async () =>
    ID !== undefined && (await refresh({ id: ID }))

  const getConfirmationDescription = () =>
    `${T.Backup}: ${modalLabel}. ${T.DoYouWantProceed}`

  const handleConfirmAction = ({ title, onSubmit }) =>
    showModal({
      isConfirmDialog: true,
      dialogProps: {
        title,
        description: getConfirmationDescription(),
      },
      onSubmit,
    })

  const handleRename = async (newName) => {
    await rename({ id: ID, name: newName })
    await refreshCurrentData()
  }

  const handleRestore = () =>
    showModal({
      isFormDialog: true,
      name: T.Restore,
      dialogProps: {
        title: T.RestoreBackup,
        dataCy: 'modal-restore-backup',
        ...getRestoreFormConfig(data),
      },
      onSubmit: async (formData) => {
        await restore({
          id: ID,
          datastore: formData.datastore,
          options: getBackupRestoreOptions(formData),
        })
        await refreshCurrentData()
      },
    })

  const handleDelete = () =>
    handleConfirmAction({
      title: T.Delete,
      onSubmit: async () => {
        await deleteImage({ id: ID })
        handleClose()
      },
    })

  const handleChangePermission = async (newPermission) => {
    await changePermissions({ id: ID, ...newPermission })
    await refreshCurrentData()
  }

  const handleChangeOwnership = async (newOwnership) => {
    await changeOwnership({ id: ID, ...newOwnership })
    await refreshCurrentData()
  }

  const attributes = useMemo(
    () =>
      Object.entries(data?.TEMPLATE ?? {})?.map(([key, value]) => ({
        key,
        value,
      })),
    [data]
  )

  const handleDeleteAttribute = async (index, attribute) => {
    const attributeKey = attribute?.path ?? attributes?.[index]?.key

    if (!attributeKey) return

    const newAttributes = cloneObject(TEMPLATE)
    unset(newAttributes, attributeKey)

    await update({
      id: ID,
      replace: 0,
      template: jsonToXml(newAttributes),
    })
    await refreshCurrentData()
  }

  const getAttributePayload = (attribute, newValue) =>
    typeof attribute === 'string'
      ? { key: attribute, value: newValue }
      : attribute ?? {}

  const handleAttributeInXml = async (attribute, newValue) => {
    const { key, path, value } = getAttributePayload(attribute, newValue)
    const attributePath = path ?? key

    if (!attributePath) return

    const newTemplate = cloneObject(TEMPLATE)
    set(newTemplate, attributePath, value)

    await update({
      id: ID,
      template: jsonToXml(newTemplate),
      replace: 1,
    })
    await refreshCurrentData()
  }

  const toggleOptions = [
    [
      {
        startIcon: <RefreshDouble width="16px" height="16px" />,
        onClick: handleRefresh,
        value: 'refresh',
        tooltip: T.Refresh,
        isDisabled: isActionsDisabled,
      },
      ...createActions({
        filters: availableActions,
        actions: [
          {
            accessor: IMAGE_ACTIONS.RESTORE,
            startIcon: <RefreshCircular width="16px" height="16px" />,
            onClick: handleRestore,
            value: IMAGE_ACTIONS.RESTORE,
            tooltip: T.Restore,
            isDisabled: isActionsDisabled,
          },
        ],
      }),
    ],
    [
      ...createActions({
        filters: availableActions,
        actions: [
          {
            accessor: IMAGE_ACTIONS.DELETE,
            startIcon: (
              <Trash
                width="16px"
                height="16px"
                style={{
                  color: isActionsDisabled
                    ? palette.text.disabled
                    : palette.icon.error,
                }}
              />
            ),
            onClick: handleDelete,
            value: IMAGE_ACTIONS.DELETE,
            title: T.Delete,
            isDisabled: isActionsDisabled,
          },
        ],
      }),
      {
        startIcon: <Cancel width="16px" height="16px" />,
        onClick: handleClose,
        value: 'close',
        tooltip: T.Close,
      },
    ],
  ].filter(({ length }) => length > 0)

  return (
    <DetailsDrawer
      isOpen={isOpen}
      slots={[
        [
          InfoSlot,
          {
            isTitleEditable: true,
            onTitleChange: handleRename,
            isTitleEditDisabled: isRenaming,

            title: data?.NAME,
            id: ID,
            Toolbar: () => (
              <Box
                sx={(theme) => ({
                  display: 'flex',
                  flexDirection: 'row',
                  gap: `${theme.scale[500]}px`,
                })}
              >
                <ToggleGroup size="medium" options={toggleOptions} />
              </Box>
            ),
          },
        ],
        [
          SummarySlot,
          {
            labels: [
              [type ?? '-', T.Type],
              [DATASTORE ?? '-', T.Datastore],
              [+PERSISTENT ? T.Persistent : T.NonPersistent, T.Persistent],
            ],
          },
        ],
        [
          TabSlot,
          {
            tabs: BackupsResource.Tabs.Single,
            resourceId: BackupsResource.RID,
            tabProps: {
              attributes,
              selected: data,
              isLoadingData: isFetching || isUpdatingImage,
              handleChangeOwnership,
              handleChangePermission,
              handleDeleteAttribute,
              handleAddAttribute: handleAttributeInXml,
              handleEditAttribute: handleAttributeInXml,
              isActionsDisabled,
              isLocked: backupIsLocked,
            },
          },
        ],
      ]}
    />
  )
}

SingleView.displayName = 'SingleView'

SingleView.propTypes = {
  isOpen: PropTypes.bool,
  selectedData: PropTypes.object,
  availableActions: PropTypes.object,
  handleClose: PropTypes.func,
}
