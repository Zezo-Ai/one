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

import { MoreVert } from 'iconoir-react'
import PropTypes from 'prop-types'
import { memo } from 'react'
import { OneKsAPI, useGeneralApi, useModalsApi } from '@FeaturesModule'
import {
  ScalingOneksNodeGroupsForm,
  EditOneKsNodeGroupForm,
} from '@modules/resources/resources/OneKs/Forms'
import { generatePath, useHistory } from 'react-router-dom'
import { useTranslation } from '@ProvidersModule'
import { T, ONEKS_OPERATIONS, PATH } from '@ConstantsModule'
import { MenuButton, ResourceActionConfirmation } from '@ComponentsV2Module'

const RowAction = memo(({ node, id }) => {
  const { translate } = useTranslation()
  const history = useHistory()
  const { showModal } = useModalsApi()
  const { enqueueSuccess, enqueueError } = useGeneralApi()
  const [deleteNodeGroup] = OneKsAPI.useDeleteNodeGroupMutation()
  const [scaleNodeGroup] = OneKsAPI.useScaleOneKsClusterNodeGroupsMutation()
  const [recoverNodeGroup] = OneKsAPI.useRecoverOneKsNodeGroupMutation()
  const [updateNodeGroup] = OneKsAPI.useUpdateOneKsClusterNodeGroupsMutation()
  const nodeId = node?.id

  const handleRemove = async () => {
    try {
      await deleteNodeGroup({ id, nodegroup_id: nodeId }).unwrap()
      enqueueSuccess(T.SuccessNodeGroupDeleted)
    } catch (error) {
      enqueueError(T.ErrorNodeGroupDeletion)
    }
  }
  const handleScaling = async (template) => {
    try {
      await scaleNodeGroup({ id, nodegroup_id: nodeId, template }).unwrap()
      // Go to oneks logs
      history.push(generatePath(PATH.ONEKS.CREATE_CLOUD_LOGS, { id }), {
        operation: ONEKS_OPERATIONS.SCALING.name,
      })
      enqueueSuccess(T.SuccessNodeGroupScaled)
    } catch (error) {
      enqueueError(T.ErrorNodeGroupScaling)
    }
  }

  const handleRecover = async () => {
    try {
      await recoverNodeGroup({ id, nodegroup_id: nodeId }).unwrap()
      // Go to oneks logs
      history.push(generatePath(PATH.ONEKS.CREATE_CLOUD_LOGS, { id }), {
        operation: ONEKS_OPERATIONS.SCALING.name,
      })
      enqueueSuccess(T.SuccessNodeGroupRecovered)
    } catch (error) {
      enqueueError(T.ErrorNodeGroupRecovery)
    }
  }

  const oneksDialogSizeProps = {
    dialogWidth: { xs: 'calc(100vw - 32px)', md: '900px', lg: '1040px' },
    dialogMaxWidth: 'calc(100vw - 32px)',
    dialogMaxHeight: 'calc(100vh - 64px)',
    dialogPaperOverflow: 'visible',
    dialogContentMaxHeight: '50vh',
    dialogContentOverflowY: 'auto',
  }

  const handleEdit = async (template) => {
    try {
      await updateNodeGroup({ id, nodegroup_id: nodeId, template }).unwrap()
      enqueueSuccess(T.SuccessUpdateNodeGroup)
    } catch (error) {
      enqueueError(T.ErrorUpdateNodeGroup)
    }
  }

  const handleOpenEditForm = () =>
    showModal({
      dialogProps: {
        title: T.EditNodeGroup,
        dataCy: 'modal-edit-node',
        ...oneksDialogSizeProps,
      },
      form: EditOneKsNodeGroupForm({
        initialValues: {
          name: node?.name,
          description: node?.description,
        },
      }),
      onSubmit: handleEdit,
    })

  const handleOpenScalingForm = () =>
    showModal({
      dialogProps: {
        title: T.ResizeNodeGroup,
        dataCy: 'modal-scaling-node',
        ...oneksDialogSizeProps,
      },
      form: ScalingOneksNodeGroupsForm,
      onSubmit: handleScaling,
    })

  const handleOpenRecoverForm = () =>
    showModal({
      isConfirmDialog: true,
      dialogProps: {
        title: T.RecoverNodeGroup,
        dataCy: 'modal-recover-node',
        description: (
          <ResourceActionConfirmation
            description={T['resource.recover.confirmation']}
            resources={{ ID: nodeId, NAME: node?.name }}
            resourceType={T.NodeGroups}
          />
        ),
        confirmLabel: T.Recover,
      },
      onSubmit: handleRecover,
    })

  const handleOpenRemoveForm = () =>
    showModal({
      isConfirmDialog: true,
      dialogProps: {
        title: T.DeleteNodeGroup,
        dataCy: 'modal-delete-node',
        description: (
          <ResourceActionConfirmation
            description={T['resource.delete.confirmation']}
            resources={{ ID: nodeId, NAME: node?.name }}
            resourceType={T.NodeGroups}
          />
        ),
        confirmLabel: T.Delete,
        confirmButtonProps: {
          isDestructive: true,
        },
      },
      onSubmit: handleRemove,
    })

  const options = [
    {
      'data-cy': `edit-${nodeId}`,
      title: translate(T.EditNodeGroup),
      onClick: handleOpenEditForm,
    },
    {
      'data-cy': `scaling-${nodeId}`,
      title: translate(T.ResizeNodeGroup),
      onClick: handleOpenScalingForm,
    },
    {
      'data-cy': `recover-${nodeId}`,
      title: translate(T.RecoverNodeGroup),
      onClick: handleOpenRecoverForm,
    },
    {
      'data-cy': `delete-${nodeId}`,
      title: translate(T.DeleteNodeGroup),
      onClick: handleOpenRemoveForm,
    },
  ]

  return <MenuButton iconOnly={<MoreVert />} options={[options]} />
})

RowAction.propTypes = {
  node: PropTypes.object.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
}

RowAction.displayName = 'RowAction'

export default RowAction
