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
import { Box, Stack } from '@mui/material'
import PropTypes from 'prop-types'
import { ReactElement } from 'react'

import {
  AddVLANRuleAction,
  DeleteVLANRuleAction,
  UpdateVLANRuleAction,
} from '@modules/components/Buttons'
import VLANRuleCard from '@modules/components/Cards/VLANRuleCard'
import { GroupAPI } from '@FeaturesModule'
import { jsonToXml } from '@ModelsModule'

import { VLANRule, GROUP_ACTIONS } from '@ConstantsModule'

const { ADD_VLAN_RULE, UPDATE_VLAN_RULE, DELETE_VLAN_RULE } = GROUP_ACTIONS

const handleAdd = async ({ value, id, update, template }) => {
  const vlanRules = [template?.RULE ?? []].flat()
  vlanRules.push(value)
  const templateJson = { ...template, RULE: vlanRules }

  const newTemplate = jsonToXml(templateJson)
  await update({ id, vlanRule: newTemplate }).unwrap()
}

const handleUpdate = async ({ value, id, vlanRuleID, update, template }) => {
  let templateJson = { ...template, RULE: value }

  if (Array.isArray(template?.RULE)) {
    const vlanRules = [template.RULE ?? []].flat()
    vlanRules[vlanRuleID] = value
    templateJson = { ...template, RULE: vlanRules }
  }

  const newTemplate = jsonToXml(templateJson)
  await update({ id, vlanRule: newTemplate }).unwrap()
}

const handleDelete = async ({ id, vlanRuleID, update, template }) => {
  const { RULE, ...rest } = template
  let templateJson = { ...rest }

  if (Array.isArray(template?.RULE)) {
    const vlanRules = [template.RULE ?? []].flat()
    vlanRules.splice(vlanRuleID, 1)
    templateJson = { ...template, RULE: vlanRules }
  }

  const newTemplate = jsonToXml(templateJson)
  await update({ id, vlanRule: newTemplate }).unwrap()
}

/**
 * Renders the list of VLAN Rules from a Group.
 *
 * @param {object} props - Props
 * @param {object} props.tabProps - Tab information
 * @param {string[]} props.tabProps.actions - Actions tab
 * @param {string} props.id - Group id
 * @param {object} props.oneConfig - Open Nebula configuration
 * @param {boolean} props.adminGroup - If the user belongs to oneadmin group
 * @returns {ReactElement} VLAN Rules tab
 */
const VLANRuleTab = ({
  tabProps: { actions } = {},
  id,
  oneConfig,
  adminGroup,
}) => {
  const { data: group } = GroupAPI.useGetGroupQuery({ id })
  const [vlanRuleGroup] = GroupAPI.useVlanRuleGroupMutation()

  /** @type {VLANRule[]} */
  const vlanRules = [group?.VLAN_RULES?.RULE ?? []].flat()
  const template = group?.VLAN_RULES

  return (
    <Box padding={{ sm: '0.8em' }}>
      {actions[ADD_VLAN_RULE] === true && (
        <AddVLANRuleAction
          groupId={id}
          oneConfig={oneConfig}
          adminGroup={adminGroup}
          onSubmit={(value) =>
            handleAdd({
              value,
              id,
              update: vlanRuleGroup,
              template,
            })
          }
        />
      )}

      <Stack gap="1em" py="0.8em">
        {vlanRules.map((vlanRule, vlanRuleID) => (
          <VLANRuleCard
            key={vlanRuleID}
            group={group}
            vlanRuleId={vlanRuleID}
            vlanRule={vlanRule}
            actions={
              <>
                {actions[UPDATE_VLAN_RULE] === true && (
                  <UpdateVLANRuleAction
                    groupId={id}
                    vlanRule={vlanRule}
                    vlanRuleId={vlanRuleID}
                    oneConfig={oneConfig}
                    adminGroup={adminGroup}
                    onSubmit={(value) =>
                      handleUpdate({
                        value,
                        id,
                        vlanRuleID,
                        update: vlanRuleGroup,
                        template,
                      })
                    }
                  />
                )}
                {actions[DELETE_VLAN_RULE] === true && (
                  <DeleteVLANRuleAction
                    groupId={id}
                    vlanRule={vlanRule}
                    vlanRuleId={vlanRuleID}
                    oneConfig={oneConfig}
                    adminGroup={adminGroup}
                    onSubmit={() =>
                      handleDelete({
                        id,
                        vlanRuleID,
                        update: vlanRuleGroup,
                        template,
                      })
                    }
                  />
                )}
              </>
            }
          />
        ))}
      </Stack>
    </Box>
  )
}

VLANRuleTab.propTypes = {
  tabProps: PropTypes.object,
  id: PropTypes.string,
  oneConfig: PropTypes.object,
  adminGroup: PropTypes.bool,
}

VLANRuleTab.displayName = 'VLANRuleTab'
VLANRuleTab.label = 'VLAN Rules'

export default VLANRuleTab
