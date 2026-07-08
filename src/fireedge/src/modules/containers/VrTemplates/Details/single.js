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
  ButtonGroup,
} from '@ComponentsV2Module'

import { Component } from 'react'
import { prettyBytes, timeFromMilliseconds } from '@UtilsModule'
import { Form, VrTemplate } from '@ResourcesModule'
import {
  T,
  RESOURCE_NAMES,
  UNITS,
  STATIC_FILES_URL,
  DEFAULT_TEMPLATE_LOGO,
  PATH,
} from '@ConstantsModule'
import { Box, useTheme } from '@mui/material'
import PropTypes from 'prop-types'
import {
  RefreshDouble,
  Edit,
  KeyframesCouple as CloneIcon,
  GridAdd,
  Cancel,
  Trash,
  Lock,
  NoLock,
  Play,
} from 'iconoir-react'
import { useHistory } from 'react-router'
import { VmTemplateAPI, useModalsApi } from '@FeaturesModule'

/**
 * @param {object} root0 - Params
 * @param {boolean} root0.isOpen - Is isOpen
 * @param {object} root0.selectedTemplate - Selected VM template
 * @param {Function} root0.handleClose - Handle close
 * @param {Array} root0.actions - Available actions
 * @returns {Component} - Single view details drawer
 */
export const SingleView = ({
  isOpen = false,
  selectedTemplate = {},
  handleClose,
  actions,
}) => {
  const { palette } = useTheme()
  const history = useHistory()
  const { showModal } = useModalsApi()
  const [refreshTemplate, { isFetching: isRefreshingTemplate }] =
    VmTemplateAPI.useLazyGetTemplateQuery()

  const [rename, { isLoading: isRenaming }] =
    VmTemplateAPI.useRenameTemplateMutation()
  const [remove, { isLoading: isRemoving }] =
    VmTemplateAPI.useRemoveTemplateMutation()
  const [clone, { isLoading: isCloning }] =
    VmTemplateAPI.useCloneTemplateMutation()
  const [lock, { isLoading: isLocking }] =
    VmTemplateAPI.useLockTemplateMutation()
  const [unlock, { isLoading: isUnlocking }] =
    VmTemplateAPI.useUnlockTemplateMutation()

  const [changePermissions, { isLoading: isChangingPermissions }] =
    VmTemplateAPI.useChangeTemplatePermissionsMutation()
  const [changeOwnership, { isLoading: isChangingOwnership }] =
    VmTemplateAPI.useChangeTemplateOwnershipMutation()

  const handleOpenCloneForm = () =>
    showModal({
      name: T.Clone,

      dialogProps: {
        title: T.Clone,
        dataCy: 'modal-clone',
      },

      onSubmit: async (cloneData) =>
        await clone({ id: selectedTemplate?.ID, ...cloneData }),
      form: Form.VmTemplate.CloneForm({
        stepProps: { isMultiple: false },
        initialValues: { name: `Copy of ${selectedTemplate?.NAME}` },
      }),
    })

  const handleOpenDeleteForm = () =>
    showModal({
      isConfirmDialog: true,
      dialogProps: {
        title: `${T.Delete} ${T.VRTemplate}`,
        description: T['template.delete.confirmation'],
      },
      onSubmit: async () => {
        await remove({ id: selectedTemplate?.ID })
        handleClose()
      },
    })

  const handleInstantiate = () =>
    history.push(PATH.TEMPLATE.VROUTERS.INSTANTIATE, selectedTemplate)

  const handleRename = async (newName) => {
    await rename({ id: selectedTemplate?.ID, name: newName })
  }

  const handleLock = async () => {
    await lock({ id: selectedTemplate?.ID })
    await refreshTemplate({ id: selectedTemplate?.ID })
  }

  const handleUnlock = async () => {
    await unlock({ id: selectedTemplate?.ID })
    await refreshTemplate({ id: selectedTemplate?.ID })
  }

  const handleEdit = () => {
    history.push(PATH.TEMPLATE.VROUTERS.UPDATE, selectedTemplate)
  }

  const handleExport = () => {
    history.push(PATH.STORAGE.MARKETPLACE_APPS.CREATE, [
      RESOURCE_NAMES.VM_TEMPLATE,
      selectedTemplate,
    ])
  }

  const handleChangePermission = async (newPermission) => {
    await changePermissions({ id: selectedTemplate?.ID, ...newPermission })
    await refreshTemplate({ id: selectedTemplate?.ID })
  }

  const handleChangeOwnership = async (newOwnership) => {
    await changeOwnership({ id: selectedTemplate?.ID, ...newOwnership })
    await refreshTemplate({ id: selectedTemplate?.ID })
  }

  const isActionsDisabled =
    isLocking ||
    isUnlocking ||
    isCloning ||
    isRenaming ||
    isRemoving ||
    isRefreshingTemplate ||
    isChangingOwnership ||
    isChangingPermissions

  const templateIsLocked = Object.hasOwn(selectedTemplate, 'LOCK')

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

            icon: `${STATIC_FILES_URL}/${
              selectedTemplate?.TEMPLATE?.LOGO ?? DEFAULT_TEMPLATE_LOGO
            }`,
            title: selectedTemplate?.NAME,
            id: selectedTemplate?.ID,
            labels: [
              [T.Owner, selectedTemplate?.UNAME],
              [T.Group, selectedTemplate?.GNAME],
              [
                `${T.Registered} ${timeFromMilliseconds(
                  +selectedTemplate?.REGTIME
                ).toRelative()}`,
              ],
            ],
            Toolbar: () => (
              <Box
                sx={(theme) => ({
                  display: 'flex',
                  flexDirection: 'row',
                  gap: `${theme.scale[500]}px`,
                })}
              >
                <ButtonGroup
                  selected={[templateIsLocked ? 'lock' : 'unlock']}
                  buttons={[
                    {
                      startIcon: <Lock width="16px" height="16px" />,
                      onClick: handleLock,
                      value: 'lock',
                      isDisabled: isActionsDisabled,
                    },
                    {
                      startIcon: <NoLock width="16px" height="16px" />,
                      onClick: handleUnlock,
                      value: 'unlock',
                      isDisabled: isActionsDisabled,
                    },
                  ]}
                />
                <ToggleGroup
                  size="medium"
                  options={[
                    [
                      {
                        startIcon: <RefreshDouble width="16px" height="16px" />,
                        onClick: () =>
                          refreshTemplate({ id: selectedTemplate?.ID }),
                        value: 'refresh',
                        isDisabled: isActionsDisabled,
                      },
                      {
                        startIcon: <Play width="16px" height="16px" />,
                        onClick: handleInstantiate,
                        value: 'instantiate',
                        isDisabled: isActionsDisabled,
                      },
                      {
                        startIcon: <GridAdd width="16px" height="16px" />,
                        onClick: handleExport,
                        value: 'export',
                        isDisabled: templateIsLocked || isActionsDisabled,
                      },
                    ],

                    [
                      {
                        startIcon: <Edit width="16px" height="16px" />,
                        onClick: handleEdit,
                        value: 'edit',
                        isDisabled: templateIsLocked || isActionsDisabled,
                      },
                      {
                        startIcon: <CloneIcon width="16px" height="16px" />,
                        onClick: handleOpenCloneForm,
                        value: 'clone',
                        isDisabled: templateIsLocked || isActionsDisabled,
                      },
                    ],

                    [
                      {
                        startIcon: (
                          <Trash
                            width="16px"
                            height="16px"
                            style={{
                              color:
                                templateIsLocked || isActionsDisabled
                                  ? palette.text.disabled
                                  : palette.icon.error,
                            }}
                          />
                        ),
                        onClick: handleOpenDeleteForm,
                        value: 'delete',
                        isDisabled: templateIsLocked || isActionsDisabled,
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
              [
                selectedTemplate?.TEMPLATE?.HYPERVISOR?.toUpperCase(),
                T.Hypervisor,
              ],

              [selectedTemplate?.TEMPLATE?.VCPU ?? '-', T.vcpu],
              [
                prettyBytes(selectedTemplate?.TEMPLATE?.MEMORY, UNITS.MB),
                T.Memory,
              ],
            ]?.filter(([value]) => value !== undefined),
          },
        ],
        [
          TabSlot,
          {
            tabs: VrTemplate.Tabs.Single,
            resourceId: VrTemplate.RID,
            tabProps: {
              selected: selectedTemplate,
              handleChangeOwnership,
              handleChangePermission,
              isLocked: templateIsLocked,
              isActionsDisabled,
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
  selectedTemplate: PropTypes.object,
  handleClose: PropTypes.func,
  actions: PropTypes.array,
}
