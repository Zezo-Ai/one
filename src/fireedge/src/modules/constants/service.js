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
import * as STATES from '@modules/constants/states'
import * as ACTIONS from '@modules/constants/actions'

/**
 * @typedef {'CHANGE'|'CARDINALITY'|'PERCENTAGE_CHANGE'} AdjustmentType
 */

/**
 * @typedef ElasticityPolicy
 * @property {AdjustmentType} type - Type of adjustment
 * @property {string} adjust - Adjustment type
 * @property {string} [min_adjust_type] - Minimum adjustment type
 * @property {string} [cooldown] - Cooldown period duration after a scale operation, in seconds
 * @property {string} [period] - Duration, in seconds, of each period in period_number
 * @property {string} [period_number] - Number of periods that the expression must be true before the elasticity is triggered
 * @property {string} expression - Expression to trigger the elasticity
 * @property {string} [last_eval] - Last time the policy was evaluated
 * @property {string} [true_evals] - Number of times the policy was evaluated to true
 * @property {string} [expression_evaluated] - Expression evaluated to true
 */

/**
 * @typedef ScheduledPolicy
 * @property {AdjustmentType} type - Type of adjustment
 * @property {string} adjust - Adjustment type
 * @property {string} [min_adjust_step] - Optional parameter for PERCENTAGE_CHANGE adjustment type.
 * If present, the policy will change the cardinality by at least the number of VMs set in this attribute.
 * @property {string} [recurrence] - Time for recurring adjustments. Time is specified with the Unix cron syntax
 * @property {string} [start_time] - Exact time for the adjustment
 * @property {string} [cooldown] - Cooldown period duration after a scale operation, in seconds
 * @property {string} [last_eval] - Last time the policy was evaluated
 */

/**
 * @typedef Node
 * @property {string} deploy_id - Deployment id
 * @property {object} vm_info - VM information
 * @property {object} vm_info.VM - Virtual machine object
 * @property {string} vm_info.VM.ID - VM id
 * @property {string} vm_info.VM.NAME - VM name
 * @property {string} vm_info.VM.UID - Owner id
 * @property {string} vm_info.VM.UNAME - Owner name
 * @property {string} vm_info.VM.GID - Group id
 * @property {string} vm_info.VM.GNAME - Group name
 */

/**
 * @typedef Role
 * @property {string} name - Name
 * @property {string} cardinality - Cardinality
 * @property {string[]} [parents] - Names of the roles that must be deployed before this one
 * @property {string} [last_vmname] - ??
 * @property {string} state - Role state (see @see ROLE_STATES for more info)
 * @property {string} vm_template - OpenNebula VM Template ID
 * @property {string} [vm_template_contents] - Contents to be used into VM template
 * @property {'shutdown'|'shutdown-hard'} [shutdown_action] - VM shutdown action
 * @property {string} [min_vms] - Minimum number of VMs for elasticity adjustments
 * @property {string} [max_vms] - Maximum number of VMs for elasticity adjustments
 * @property {string} [cooldown] - Cooldown period duration after a scale operation, in seconds.
 * If it is not set, the default set in `oneflow-server.conf` will be used.
 * @property {boolean} [on_hold] - VM role is on hold (not deployed)
 * @property {ElasticityPolicy[]} [elasticity_policies] - Elasticity Policies
 * @property {ElasticityPolicy[]} [scheduled_policies] - Scheduled Policies
 * @property {Node[]} nodes - Nodes information (see @see Node for more info)
 */

/**
 * @typedef ServiceLogItem
 * @property {string} message - Log message
 * @property {SERVICE_LOG_SEVERITY} severity - Severity (see @see SERVICE_LOG_SEVERITY for more info)
 * @property {string} timestamp - Timestamp
 */

/**
 * @typedef Service
 * @property {string} ID - Id
 * @property {string} NAME - Name
 * @property {string} UID - User id
 * @property {string} UNAME - User name
 * @property {string} GID - Group id
 * @property {string} GNAME - Group name
 * @property {Permissions} [PERMISSIONS] - Permissions
 * @property {object} TEMPLATE - Template
 * @property {object} TEMPLATE.BODY - Body in JSON format
 * @property {string} TEMPLATE.BODY.name - Template name
 * @property {string} TEMPLATE.BODY.description - Template description
 * @property {string} TEMPLATE.BODY.state - Service state
 * @property {object} [TEMPLATE.BODY.custom_attrs] - Hash of custom attributes to use in the service
 * @property {object} [TEMPLATE.BODY.custom_attrs_values] - ??
 * @property {'straight'|'none'} [TEMPLATE.BODY.deployment] - Deployment strategy of the service:
 * - 'none' - all roles are deployed at the same time
 * - 'straight' - each role is deployed when all its parents are RUNNING
 * @property {ServiceLogItem[]} [TEMPLATE.BODY.log] - Log items
 * @property {object} [TEMPLATE.BODY.networks] - Network to print an special user inputs on instantiation form
 * @property {object[]} [TEMPLATE.BODY.networks_values] - Network values to include on roles
 * @property {boolean} [TEMPLATE.BODY.ready_status_gate] - If ready_status_gate is set to true,
 * a VM will only be considered to be in running state the following points are true:
 *
 * - VM is in running state for OpenNebula. Which specifically means that LCM_STATE == 3 and STATE >= 3
 * - The VM has READY=YES in the user template, this can be reported by the VM using OneGate
 * @property {'terminate'|'terminate-hard'|'shutdown'|'shutdown-hard'} [TEMPLATE.BODY.shutdown_action] - VM shutdown action
 * @property {Role[]} TEMPLATE.BODY.roles - Roles information (see @see Role for more info)
 * @property {string} [TEMPLATE.BODY.registration_time] - Registration time
 * @property {boolean} [TEMPLATE.BODY.automatic_deletion] - Automatic deletion
 * @property {boolean} [TEMPLATE.BODY.on_hold] - VMs of the service are on hold (not deployed)
 */

/** @type {STATES.StateInfo[]} Service states */
export const SERVICE_STATES = [
  {
    // 0
    name: STATES.PENDING,
    color: 'information',
  },
  {
    // 1
    name: STATES.DEPLOYING,
    color: 'information',
  },
  {
    // 2
    name: STATES.RUNNING,
    color: 'success',
  },
  {
    // 3
    name: STATES.UNDEPLOYING,
    color: 'error',
  },
  {
    // 4
    name: STATES.WARNING,
    color: 'warning',
  },
  {
    // 5
    name: STATES.DONE,
    color: 'disabled',
  },
  {
    // 6
    name: STATES.FAILED_UNDEPLOYING,
    color: 'error',
  },
  {
    // 7
    name: STATES.FAILED_DEPLOYING,
    color: 'error',
  },
  {
    // 8
    name: STATES.SCALING,
    color: 'information',
  },
  {
    // 9
    name: STATES.FAILED_SCALING,
    color: 'error',
  },
  {
    // 10
    name: STATES.COOLDOWN,
    color: 'information',
  },
  {
    // 11
    name: STATES.DEPLOYING_NETS,
    color: 'information',
  },
  {
    // 12
    name: STATES.UNDEPLOYING_NETS,
    color: 'error',
  },
  {
    // 13
    name: STATES.FAILED_DEPLOYING_NETS,
    color: 'error',
  },
  {
    // 14
    name: STATES.FAILED_UNDEPLOYING_NETS,
    color: 'error',
  },
  {
    // 15
    name: STATES.HOLD,
    color: 'information',
  },
]

/** @type {STATES.StateInfo[]} Role states */
export const ROLE_STATES = [
  {
    // 0
    name: STATES.PENDING,
    color: 'information',
  },
  {
    // 1
    name: STATES.DEPLOYING,
    color: 'information',
  },
  {
    // 2
    name: STATES.RUNNING,
    color: 'success',
  },
  {
    // 3
    name: STATES.UNDEPLOYING,
    color: 'error',
  },
  {
    // 4
    name: STATES.WARNING,
    color: 'warning',
  },
  {
    // 5
    name: STATES.DONE,
    color: 'disabled',
  },
  {
    // 6
    name: STATES.FAILED_UNDEPLOYING,
    color: 'error',
  },
  {
    // 7
    name: STATES.FAILED_DEPLOYING,
    color: 'error',
  },
  {
    // 8
    name: STATES.SCALING,
    color: 'information',
  },
  {
    // 9
    name: STATES.FAILED_SCALING,
    color: 'error',
  },
  {
    // 10
    name: STATES.COOLDOWN,
    color: 'information',
  },
  {
    // 11
    name: STATES.HOLD,
    color: 'information',
  },
]

/** @enum {string} Role actions */
export const ROLE_ACTIONS = {
  DISK_SNAPSHOT_CREATE: 'disk-snapshot-create',
  DISK_SNAPSHOT_DELETE: 'disk-snapshot-delete',
  DISK_SNAPSHOT_REVERT: 'disk-snapshot-revert',
  HOLD: 'hold',
  POWEROFF: 'poweroff',
  POWEROFF_HARD: 'poweroff-hard',
  REBOOT: 'reboot',
  REBOOT_HARD: 'reboot-hard',
  RELEASE: 'release',
  RESUME: 'resume',
  SNAPSHOT_CREATE: 'snapshot-create',
  SNAPSHOT_DELETE: 'snapshot-delete',
  SNAPSHOT_REVERT: 'snapshot-revert',
  STOP: 'stop',
  SUSPEND: 'suspend',
  TERMINATE: 'terminate',
  TERMINATE_HARD: 'terminate-hard',
  UNDEPLOY: 'undeploy',
  UNDEPLOY_HARD: 'undeploy-hard',
}

export const ROLE_ACTION_ENUM = Object.freeze(
  Object.fromEntries(Object.keys(ROLE_ACTIONS).map((key) => [key, key]))
)

/** @enum {string} Service actions */
export const SERVICE_ACTIONS = {
  ADD_ROLE: 'add_role',
  CHANGE_GROUP: ACTIONS.CHANGE_GROUP,
  CHANGE_MODE: ACTIONS.CHANGE_MODE,
  CHANGE_OWNER: ACTIONS.CHANGE_OWNER,
  DELETE: 'delete',
  PERFORM_ACTION: 'perform_action',
  RECOVER: 'recover',
  RECOVER_DELETE: 'recover_delete',
  RENAME: ACTIONS.RENAME,
  SCALE_ROLE: 'scale',
}

export const SERVICE_ACTION_ENUM = Object.freeze(
  Object.fromEntries(Object.keys(SERVICE_ACTIONS).map((key) => [key, key]))
)

/** @type {string[]} Actions that can be scheduled */
export const ROLE_ACTIONS_WITH_SCHEDULE = [
  ROLE_ACTIONS.HOLD,
  ROLE_ACTIONS.POWEROFF_HARD,
  ROLE_ACTIONS.POWEROFF,
  ROLE_ACTIONS.REBOOT_HARD,
  ROLE_ACTIONS.REBOOT,
  ROLE_ACTIONS.RELEASE,
  ROLE_ACTIONS.RESUME,
  ROLE_ACTIONS.SNAPSHOT_CREATE,
  ROLE_ACTIONS.SNAPSHOT_DELETE,
  ROLE_ACTIONS.DISK_SNAPSHOT_CREATE,
  ROLE_ACTIONS.DISK_SNAPSHOT_DELETE,
  ROLE_ACTIONS.DISK_SNAPSHOT_REVERT,
  ROLE_ACTIONS.SNAPSHOT_REVERT,
  ROLE_ACTIONS.STOP,
  ROLE_ACTIONS.SUSPEND,
  ROLE_ACTIONS.TERMINATE_HARD,
  ROLE_ACTIONS.TERMINATE,
  ROLE_ACTIONS.UNDEPLOY_HARD,
  ROLE_ACTIONS.UNDEPLOY,
]

/** @enum {string} Log severity levels for service logs */
export const SERVICE_LOG_SEVERITY = {
  DEBUG: 'D',
  INFO: 'I',
  ERROR: 'E',
}
