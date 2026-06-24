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
import { T } from '@modules/constants'

/**
 * @typedef {string|'-1'} VNTEMPLATE
 * - For each rule, there just one special case:
 * ``-1``: any VN Template.
 */

/** @typedef {'VLAN_ID'|'OUTER_VLAN_ID'|'CVLAN'|'VLAN_TAGGED_ID'|'ANY'} SCOPE */

/**
 * @typedef VLANRule
 * @property {string} ID - VLAN ID
 * @property {SCOPE} SCOPE - Scope of the rule
 * @property {VNTEMPLATE} VNTEMPLATE - VN Template IDs associated to the Rule. Ex: '100-200,202'
 */

export const VLAN_GROUP_RULE_SCOPE_STRING = {
  VLAN_ID: T.VLAN_ID,
  OUTER_VLAN_ID: T.OUTER_VLAN_ID,
  CVLAN: T.CVLAN,
  VLAN_TAGGED_ID: T.VLAN_TAGGED_ID,
  ANY: T.ANY,
}

export const VLAN_GROUP_RULE_TYPE_STRING = {
  VNET: T.VNET,
  CLUSTER: T.CLUSTER,
  ANY: T.ANY,
}
