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
  Edit as EditIcon,
  Plus as AddIcon,
  Trash as TrashIcon,
} from 'iconoir-react'
import PropTypes from 'prop-types'
import { memo } from 'react'

import ButtonToTriggerForm from '@modules/components/Forms/ButtonToTriggerForm'
import { AddVLANRuleForm } from '@modules/components/Forms/Group'
import { GroupAPI } from '@FeaturesModule'

import { Tr } from '@modules/components/HOC'
import {
  RESTRICTED_ATTRIBUTES_TYPE,
  T,
  GROUP_ACTIONS,
  STYLE_BUTTONS,
} from '@ConstantsModule'
import { jsonToXml } from '@ModelsModule'

import { hasRestrictedAttributes } from '@UtilsModule'

const AddVLANRuleAction = memo(
  ({ groupId, onSubmit, oneConfig, adminGroup }) => {
    const [vlanRuleGroup] = GroupAPI.useVlanRuleGroupMutation()

    const handleAdd = async (formData) => {
      if (onSubmit && typeof onSubmit === 'function') {
        return await onSubmit(formData)
      }

      const template = jsonToXml({ RULE: formData })
      await vlanRuleGroup({ id: groupId, vlanRules: template }).unwrap()
    }

    const formConfig = {
      stepProps: {
        groupId,
        oneConfig,
        adminGroup,
        restrictedAttributesType: RESTRICTED_ATTRIBUTES_TYPE.GROUP,
        nameParentAttribute: 'VLAN_RULES',
      },
    }

    return (
      <ButtonToTriggerForm
        buttonProps={{
          'data-cy': 'add-vlan-rule',
          startIcon: <AddIcon />,
          label: T['groups.actions.add-vlan-rule'],
          importance: STYLE_BUTTONS.IMPORTANCE.MAIN,
          size: STYLE_BUTTONS.SIZE.MEDIUM,
          type: STYLE_BUTTONS.TYPE.FILLED,
        }}
        options={[
          {
            dialogProps: {
              title: T['groups.actions.add-vlan-rule'],
              dataCy: 'modal-add-vlan-rule',
            },
            form: () => AddVLANRuleForm(formConfig),
            onSubmit: handleAdd,
          },
        ]}
      />
    )
  }
)

const UpdateVLANRuleAction = memo(
  ({ groupId, vlanRule, vlanRuleId, onSubmit, oneConfig, adminGroup }) => {
    const [vlanRuleGroup] = GroupAPI.useVlanRuleGroupMutation()

    const handleUpdate = async (formData) => {
      if (onSubmit && typeof onSubmit === 'function') {
        return await onSubmit(formData)
      }

      const template = jsonToXml({ RULE: formData })
      await vlanRuleGroup({ id: groupId, vlanRules: template })
    }

    return (
      <ButtonToTriggerForm
        buttonProps={{
          'data-cy': `${GROUP_ACTIONS.UPDATE_VLAN_RULE}-${vlanRuleId}`,
          icon: <EditIcon />,
          tooltip: T.Edit,
        }}
        options={[
          {
            dialogProps: {
              title: vlanRuleId
                ? `${Tr(T['groups.actions.update-vlan-rule'])}: #${vlanRuleId}`
                : `${Tr(T['groups.actions.update-vlan-rule'])}`,
              dataCy: 'modal-update-vlan-rule',
            },
            form: () =>
              AddVLANRuleForm({
                initialValues: vlanRule,
                stepProps: {
                  isUpdate: !onSubmit && vlanRuleId !== undefined,
                  oneConfig,
                  adminGroup,
                  restrictedAttributesType: RESTRICTED_ATTRIBUTES_TYPE.GROUP,
                  nameParentAttribute: 'VLAN_RULES',
                },
              }),
            onSubmit: handleUpdate,
          },
        ]}
      />
    )
  }
)

const DeleteVLANRuleAction = memo(
  ({
    groupId,
    vlanRule,
    vlanRuleId,
    onSubmit,
    oneConfig,
    adminGroup,
    submit,
  }) => {
    const [vlanRuleGroup] = GroupAPI.useVlanRuleGroupMutation()

    const handleRemove = async () => {
      if (onSubmit && typeof onSubmit === 'function') {
        return await onSubmit(vlanRuleId)
      }

      await vlanRuleGroup({ id: groupId, vlanRule: vlanRuleId })
    }

    const disabledAction =
      !adminGroup &&
      hasRestrictedAttributes(
        vlanRule,
        'VLAN_RULES',
        oneConfig?.GROUP_RESTRICTED_ATTR
      )

    return (
      <ButtonToTriggerForm
        buttonProps={{
          'data-cy': `${GROUP_ACTIONS.DELETE_VLAN_RULE}-${vlanRuleId}`,
          icon: <TrashIcon />,
          tooltip: Tr(T.DeleteVLANRule),
          disabled: disabledAction,
        }}
        options={[
          {
            isConfirmDialog: true,
            dialogProps: {
              title: vlanRuleId
                ? `${Tr(T.DeleteVLANRule)}: #${vlanRuleId}`
                : `${Tr(T.DeleteVLANRule)}`,
              children: <p>{Tr(T.DoYouWantProceed)}</p>,
            },
            onSubmit: handleRemove,
          },
        ]}
      />
    )
  }
)

const ActionPropTypes = {
  groupId: PropTypes.string,
  vlanRule: PropTypes.object,
  vlanRuleId: PropTypes.number,
  onSubmit: PropTypes.func,
  oneConfig: PropTypes.object,
  adminGroup: PropTypes.bool,
  submit: PropTypes.object,
}

AddVLANRuleAction.propTypes = ActionPropTypes
AddVLANRuleAction.displayName = 'AddVLANRuleActionButton'
UpdateVLANRuleAction.propTypes = ActionPropTypes
UpdateVLANRuleAction.displayName = 'UpdateVLANRuleActionButton'
DeleteVLANRuleAction.propTypes = ActionPropTypes
DeleteVLANRuleAction.displayName = 'DeleteVLANRuleActionButton'

export { AddVLANRuleAction, DeleteVLANRuleAction, UpdateVLANRuleAction }
