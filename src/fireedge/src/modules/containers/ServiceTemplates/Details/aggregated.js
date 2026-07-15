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
  LabelButton,
  SummarySlot,
  TabSlot,
  Button,
  ResourceActionConfirmation,
} from '@ComponentsV2Module'

import { useModalsApi, ServiceTemplateAPI, oneApi } from '@FeaturesModule'
import { Component, useMemo } from 'react'
import { aggregateMetrics } from '@UtilsModule'
import { T, STYLE_BUTTONS, RESOURCE_NAMES } from '@ConstantsModule'
import { Box } from '@mui/material'
import PropTypes from 'prop-types'
import { Trash, Cancel as CloseIcon } from 'iconoir-react'
import { ServiceTemplate } from '@ResourcesModule'

/**
 * @param {object} root0 - Params
 * @param {boolean} root0.isOpen - Is isOpen
 * @param {object} root0.selectedTemplates - Selected VM template
 * @param {Function} root0.handleClose - Handle close
 * @param {Function} root0.handleSelect - Handle select
 * @param {Function} root0.handleDeselect - Handle deselect
 * @param {Array} root0.actions - Available actions
 * @returns {Component} - Single view details drawer
 */
export const AggregatedView = ({
  isOpen = false,
  selectedTemplates = [],
  handleClose,
  handleSelect,
  handleDeselect,
  actions,
}) => {
  const { showModal } = useModalsApi()

  const [selectedVmTemplateIds, allVmTemplateIds] = useMemo(() => {
    const map = Object.fromEntries(
      []
        .concat(selectedTemplates)
        .map((t) => [
          t.ID,
          (t?.TEMPLATE?.BODY?.roles ?? [])
            .map((r) => r?.template_id)
            .filter(Boolean),
        ])
    )

    return [map, [...new Set(Object.values(map).flat())]]
  }, [selectedTemplates])

  const { data: vmTemplates } = oneApi.endpoints.getTemplates.useQueryState(
    undefined,
    {
      selectFromResult: ({ data }) => ({
        data: [].concat(data).filter((t) => allVmTemplateIds.includes(+t?.ID)),
      }),
    }
  )

  const serviceTemplateMetrics = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(selectedVmTemplateIds).map(([serviceId, vmIds]) => [
          serviceId,
          aggregateMetrics(
            vmTemplates?.filter((t) => vmIds.includes(+t.ID)) ?? [],
            ['TEMPLATE.VCPU', 'TEMPLATE.MEMORY']
          ),
        ])
      ),
    [selectedVmTemplateIds, vmTemplates]
  )

  const [refreshTemplate, { isFetching: isRefreshingTemplate }] =
    ServiceTemplateAPI.useLazyGetServiceTemplateQuery()

  const [remove, { isLoading: isRemoving }] =
    ServiceTemplateAPI.useRemoveServiceTemplateMutation()

  const [changePermissions, { isLoading: isChangingPermissions }] =
    ServiceTemplateAPI.useChangeServiceTemplatePermissionsMutation()
  const [changeOwnership, { isLoading: isChangingOwnership }] =
    ServiceTemplateAPI.useChangeServiceTemplateOwnershipMutation()

  const handleRefresh = async () =>
    await Promise.all(
      selectedTemplates.map(({ ID }) => refreshTemplate({ id: ID }))
    )

  const handleChangePermission = async (newPermission) => {
    await Promise.all(
      selectedTemplates.map(({ ID }) =>
        changePermissions({ id: ID, ...newPermission })
      )
    )

    await handleRefresh()
  }

  const handleChangeOwnership = async (newOwnership) => {
    await Promise.all(
      selectedTemplates.map(({ ID }) =>
        changeOwnership({ id: ID, ...newOwnership })
      )
    )

    await handleRefresh()
  }

  const handleOpenDeleteForm = () =>
    showModal({
      isConfirmDialog: true,
      dialogProps: {
        title: `${T.Delete} ${T.ServiceTemplates}`,
        description: (
          <ResourceActionConfirmation
            description={T['resource.delete.confirmation']}
            resources={selectedTemplates}
            resourceType={T.ServiceTemplates}
          />
        ),
        confirmLabel: T.Delete,
        confirmButtonProps: {
          isDestructive: true,
        },
      },
      onSubmit: async () => {
        await Promise.all(selectedTemplates.map(({ ID }) => remove({ id: ID })))
        handleClose()
      },
    })

  const isMutating =
    isRemoving ||
    isRefreshingTemplate ||
    isChangingOwnership ||
    isChangingPermissions

  const [totalRoles, totalNetworks] = useMemo(
    () =>
      []
        .concat(selectedTemplates)
        .reduce(
          ([roles, networks], t) => [
            roles + (t?.TEMPLATE?.BODY?.roles?.length ?? 0),
            networks +
              (Object.keys(t?.TEMPLATE?.BODY?.networks ?? {})?.length ?? 0),
          ],
          [0, 0]
        ),
    [selectedTemplates]
  )

  return (
    <DetailsDrawer
      isOpen={isOpen}
      slots={[
        [
          InfoSlot,
          {
            title: `${selectedTemplates?.length} ${T.ServiceTemplates} ${T.Selected}`,
            Toolbar: () => (
              <Box
                sx={(theme) => ({
                  display: 'flex',
                  flexDirection: 'row',
                  gap: `${theme.scale[500]}px`,
                })}
              >
                <LabelButton
                  selectedRows={selectedTemplates}
                  resourceType={RESOURCE_NAMES.SERVICE_TEMPLATE}
                  isDisabled={isMutating}
                />
                <Button
                  type={STYLE_BUTTONS.TYPE.PRIMARY}
                  size="small"
                  startIcon={<Trash width={'16px'} height={'16px'} />}
                  onClick={handleOpenDeleteForm}
                  isDestructive
                >
                  {T.DeleteSelected}
                </Button>

                <Button
                  type={STYLE_BUTTONS.TYPE.TRANSPARENT}
                  size="small"
                  iconOnly={<CloseIcon width={'16px'} height={'16px'} />}
                  onClick={handleClose}
                />
              </Box>
            ),
          },
        ],
        [
          SummarySlot,
          {
            labels: [
              [totalRoles, T.Roles],
              [totalNetworks, T.Networks],
            ]?.filter(([value]) => value !== undefined),
          },
        ],
        [
          TabSlot,
          {
            tabs: ServiceTemplate.Tabs.Aggregated,
            resourceId: ServiceTemplate.RID,
            tabProps: {
              selected: selectedTemplates,
              handleChangeOwnership,
              handleChangePermission,
              serviceTemplateMetrics,
              handleSelect,
              handleDeselect,
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
  selectedTemplates: PropTypes.array,
  handleClose: PropTypes.func,
  handleSelect: PropTypes.func,
  handleDeselect: PropTypes.func,
  actions: PropTypes.array,
}
