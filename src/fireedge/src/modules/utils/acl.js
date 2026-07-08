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

import { ACL_USERS } from '@ConstantsModule'

const _ = require('lodash')

/**
 * Create a readable object from an ACL rule.
 *
 * @param {string} rule - ACL rule
 * @param {Array} users - List of users
 * @param {Array} groups - List of groups
 * @param {Array} clusters - List of clusters
 * @param {Array} zones - List of zones
 * @returns {object} The ACL rule in a readable object
 */
export const aclFromString = (rule, users, groups, clusters, zones) => {
  const acl = {
    STRING: rule,
  }

  const aclComponents = acl.STRING.split(' ')

  if (aclComponents[0]) {
    const user = aclComponents[0]
    const userType = _.find(ACL_USERS, { id: user.charAt(0) })?.type
    const userId = user.length > 1 ? user.substring(1) : undefined
    let username

    if (userType === ACL_USERS.INDIVIDUAL.type && users) {
      username = _.find(users, { ID: userId })?.NAME
    } else if (userType === ACL_USERS.GROUP.type && groups) {
      username = _.find(groups, { ID: userId })?.NAME
    }

    acl.USER = {
      type: userType,
      id: userId,
      string: aclComponents[0],
      name: username,
    }
  }

  if (aclComponents[1]) {
    const resourcesComponents = aclComponents[1].split('/')
    const resources = resourcesComponents[0].split('+')
    const resourcesIdentifier = resourcesComponents[1]
    const resourceUserType = _.find(ACL_USERS, {
      id: resourcesIdentifier?.charAt(0),
    })?.type
    const resourceId =
      resourcesIdentifier?.length > 1
        ? resourcesIdentifier?.substring(1)
        : undefined
    let resourceUsername

    if (resourceUserType === ACL_USERS.GROUP.type && groups) {
      resourceUsername = _.find(groups, { ID: resourceId })?.NAME
    } else if (resourceUserType === ACL_USERS.CLUSTER.type && clusters) {
      resourceUsername = _.find(clusters, { ID: resourceId })?.NAME
    }

    acl.RESOURCE = {
      resources,
      identifier: {
        type: resourceUserType,
        id: resourceId,
        string: resourcesIdentifier,
        name: resourceUsername,
      },
      string: resourcesComponents,
    }
  }

  if (aclComponents[2]) {
    const rights = aclComponents[2].split('+')

    acl.RIGHTS = {
      rights,
      string: aclComponents[2],
    }
  }

  if (aclComponents[3]) {
    const zone = aclComponents[3]

    if (zone) {
      const zoneType = _.find(ACL_USERS, { id: zone.charAt(0) }).type
      const zoneId = zone.length > 1 ? zone.substring(1) : undefined
      let zonename

      if (zoneType === ACL_USERS.INDIVIDUAL.type && zones) {
        zonename = _.find(zones, { ID: zoneId })?.NAME
      }

      acl.ZONE = {
        type: zoneType,
        id: zoneId,
        string: zone,
        name: zonename,
      }
    }
  }

  return acl
}
