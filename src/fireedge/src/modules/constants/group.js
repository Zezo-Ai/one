/* ------------------------------------------------------------------------- *
 * Copyright 2002-2025, OpenNebula Project, OpenNebula Systems               *
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
// eslint-disable-next-line prettier/prettier, no-unused-vars
import { VmQuota, NetworkQuota, DatastoreQuota, ImageQuota } from '@modules/constants/quota'

/**
 * @typedef Group
 * @property {string|number} ID - Id
 * @property {string} NAME - Name
 * @property {{ ID: string[] }} [USERS] - List of user ids
 * @property {{ ID: string[] }} [ADMINS] - List of admin ids
 * @property {string|number} TEMPLATE - Template
 * @property {{ DATASTORE: DatastoreQuota|DatastoreQuota[] }} [DATASTORE_QUOTA] - Datastore quotas
 * @property {{ NETWORK: NetworkQuota|NetworkQuota[] }} [NETWORK_QUOTA] - Network quotas
 * @property {{ VM: VmQuota }} [VM_QUOTA] - VM quotas
 * @property {{ IMAGE: ImageQuota|ImageQuota[] }} [IMAGE_QUOTA] - Image quotas
 * @property {{
 * DATASTORE: DatastoreQuota|DatastoreQuota[],
 * NETWORK: NetworkQuota|NetworkQuota[],
 * VM: VmQuota,
 * IMAGE: ImageQuota|ImageQuota[]
 * }} [DEFAULT_GROUP_QUOTAS] - Default quotas
 */

export const GROUP_ACTIONS = {
  CREATE_DIALOG: 'create_dialog',
  UPDATE_DIALOG: 'update_dialog',
  QUOTAS_DIALOG: 'quotas_dialog',
  DELETE: 'delete',
  EDIT_ADMINS: 'edit_admins',
  ADD_USERS: 'add_users',
  REMOVE_USERS: 'remove_users',
}
