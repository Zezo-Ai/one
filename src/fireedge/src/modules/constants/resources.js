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

export const SOCKETS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  HOOKS: 'hooks',
  GUACAMOLE: 'guacamole',
  EXTERNAL_GUACAMOLE: 'external-guacamole',
}

/** @enum {string} Names of resource */
export const RESOURCE_NAMES = {
  APP: 'marketplace-app',
  ACL: 'acl',
  BACKUP: 'backup',
  CLUSTER: 'cluster',
  DATASTORE: 'datastore',
  DRIVER: 'driver',
  GROUP: 'group',
  HOST: 'host',
  IMAGE: 'image',
  FILE: 'file',
  LOGO: 'logo',
  MARKETPLACE: 'marketplace',
  PROVIDER: 'provider',
  PROVISION: 'provision',
  SEC_GROUP: 'security-group',
  USER: 'user',
  VDC: 'virtual-data-center',
  VROUTER: 'vrouter',
  VROUTER_TEMPLATE: 'vrouter-template',
  VM_TEMPLATE: 'vm-template',
  VM_GROUP: 'vm-group',
  VM: 'vm',
  VN_TEMPLATE: 'network-template',
  VNET: 'virtual-network',
  SERVICE: 'service',
  SERVICE_TEMPLATE: 'service-template',
  ZONE: 'zone',
  BACKUPJOBS: 'backupjobs',
  SUPPORT: 'support',
  DASHBOARD: 'dashboard',
  ONEKS: 'kubernetes',
}
