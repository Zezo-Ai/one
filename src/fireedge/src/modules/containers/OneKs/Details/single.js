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
  getLabelMenuButtonProps,
  InfoSlot,
  SummarySlot,
  TabSlot,
  ToggleGroup,
} from '@ComponentsV2Module'
import { Box, useTheme } from '@mui/material'
import { Component, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { RefreshCircular, RefreshDouble, Cancel, Trash } from 'iconoir-react'
import { ONEKS_ACTIONS, RESOURCE_NAMES, T } from '@ConstantsModule'
import {
  createActions,
  permissionsToOctal,
  timeFromMilliseconds,
  toSnakeCase,
} from '@UtilsModule'
import { getLabelTags, getVirtualOneKsStateControlPlane } from '@ModelsModule'
import { OneKsAPI, useModalsApi } from '@FeaturesModule'
import { OneKs as OneKsResource } from '@ResourcesModule'

const getDocument = (data) => data?.DOCUMENT ?? data ?? {}

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

const formatTime = (time) =>
  +time > 0 ? timeFromMilliseconds(+time).toFormat('ff') : '-'

/**
 * @param {object} root0 - Params
 * @param {boolean} root0.isOpen - Is isOpen
 * @param {object} root0.selectedData - Selected OneKs cluster
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
  const [detailedData, setDetailedData] = useState()

  const selectedDocument = getDocument(selectedData)
  const selectedId = selectedDocument?.ID
  const {
    data: refreshedData = {},
    isFetching,
    refetch,
  } = OneKsAPI.useGetOneKsClusterQuery(
    { id: selectedId, expand: true },
    { skip: !isOpen || selectedId === undefined }
  )
  const [recover, { isLoading: isRecovering }] =
    OneKsAPI.useRecoverOneKsClusterMutation()
  const [deleteOneKs, { isLoading: isDeleting }] =
    OneKsAPI.useDeleteOneKsClusterMutation()
  const [updateDocument, { isLoading: isUpdating }] =
    OneKsAPI.useUpdateOneKsDocumentMutation()
  const [changePermissions, { isLoading: isChangingPermissions }] =
    OneKsAPI.useChangeOneKsClusterPermissionsMutation()
  const [changeOwnership, { isLoading: isChangingOwnership }] =
    OneKsAPI.useChangeOneKsClusterOwnershipMutation()

  const refreshedDocument = getDocument(refreshedData)
  useEffect(() => {
    if (!isOpen || selectedId === undefined) {
      setDetailedData(undefined)

      return
    }

    if (String(refreshedDocument?.ID) === String(selectedId)) {
      setDetailedData(refreshedDocument)
    }
  }, [isOpen, refreshedDocument, selectedId])

  const data =
    String(detailedData?.ID) === String(selectedId)
      ? detailedData
      : selectedDocument

  const { ID, TEMPLATE = {}, PERMISSIONS = {} } = data || {}
  const { CLUSTER_BODY = {} } = TEMPLATE
  const modalLabel = `#${ID} ${data?.NAME}`.trim()
  const { name: controlPlaneState } = useMemo(
    () => getVirtualOneKsStateControlPlane(data),
    [data]
  )

  const isActionsDisabled =
    ID === undefined ||
    isFetching ||
    isRecovering ||
    isDeleting ||
    isUpdating ||
    isChangingPermissions ||
    isChangingOwnership

  const refreshCurrentData = async () => ID !== undefined && (await refetch())

  const handleRefresh = () => refreshCurrentData()

  const getConfirmationDescription = () =>
    `OneKs: ${modalLabel}. ${T.DoYouWantProceed}`

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
    await updateDocument({ id: ID, template: { name: newName } })
    await refreshCurrentData()
  }

  const handleRecover = () =>
    handleConfirmAction({
      title: T.Recover,
      onSubmit: async () => {
        await recover({ id: ID })
        await refreshCurrentData()
      },
    })

  const handleDelete = () =>
    showModal({
      name: T.Delete,
      dialogProps: {
        title: T.Delete,
        dataCy: 'modal-delete-oneks',
      },
      form: OneKsResource.Forms.DeleteOneKsClusterForm(),
      onSubmit: async (formData) => {
        await deleteOneKs({
          id: ID,
          ...(formData?.force ? { force: true } : {}),
        })
        handleClose()
      },
    })

  const handleChangePermission = async (newPermission) => {
    const octet = getPermissionOctet(PERMISSIONS, newPermission)
    if (!octet) return

    await changePermissions({ id: ID, octet })
    await refreshCurrentData()
  }

  const handleChangeOwnership = async (newOwnership) => {
    await changeOwnership({ id: ID, ...newOwnership })
    await refreshCurrentData()
  }

  const toggleOptions = [
    [
      ...createActions({
        filters: availableActions,
        actions: [
          {
            accessor: ONEKS_ACTIONS.RECOVER,
            startIcon: <RefreshCircular width="16px" height="16px" />,
            onClick: handleRecover,
            value: ONEKS_ACTIONS.RECOVER,
            tooltip: T.Recover,
            isDisabled: isActionsDisabled,
          },
        ],
      }),
    ],
    [
      {
        ...getLabelMenuButtonProps({
          selectedRows: [data],
          resourceType: RESOURCE_NAMES.ONEKS,
          isDisabled: isActionsDisabled,
        }),
      },
      {
        startIcon: <RefreshDouble width="16px" height="16px" />,
        onClick: handleRefresh,
        value: 'refresh',
        tooltip: T.Refresh,
        isDisabled: isActionsDisabled,
      },
    ],
    [
      ...createActions({
        filters: availableActions,
        actions: [
          {
            accessor: ONEKS_ACTIONS.DELETE,
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
            value: ONEKS_ACTIONS.DELETE,
            title: T.Delete,
            isDestructive: true,
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
            isTitleEditDisabled: isActionsDisabled,
            title: data?.NAME,
            id: ID,
            tags: getLabelTags(data?.LABELS),
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
              [CLUSTER_BODY?.kubernetes_version ?? '-', T.KubernetesVersion],
              [controlPlaneState ?? '-', T.ControlPlane],
              [`${CLUSTER_BODY?.node_groups?.length ?? 0}`, T.NodeGroups],
              [formatTime(CLUSTER_BODY?.registration_time), T.CreationTime],
            ],
          },
        ],
        [
          TabSlot,
          {
            tabs: OneKsResource.Tabs.Single,
            resourceId: OneKsResource.RID,
            tabProps: {
              selected: data,
              handleChangeOwnership,
              handleChangePermission,
              isActionsDisabled,
              isMutating: isActionsDisabled,
            },
          },
          { flex: '1 1 0', minHeight: 0 },
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
