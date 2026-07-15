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
  Archive,
  BoxIso,
  CloudDownload,
  Clock,
  Db,
  EmptyPage,
  Folder,
  Group,
  HardDrive,
  HeadsetHelp,
  HistoricShield,
  List,
  MinusPinAlt,
  ModernTv,
  MultiplePagesEmpty,
  NetworkAlt,
  NewTab,
  Packages,
  RefreshDouble,
  Server,
  SettingsProfiles,
  Shuffle,
  SimpleCart,
  User,
  XrayView,
} from 'iconoir-react'
import { RESOURCE_NAMES } from '@ConstantsModule'

export const RESOURCE_ICONS = Object.freeze({
  [RESOURCE_NAMES.APP]: CloudDownload,
  [RESOURCE_NAMES.BACKUP]: RefreshDouble,
  [RESOURCE_NAMES.BACKUPJOBS]: Clock,
  [RESOURCE_NAMES.CLUSTER]: Server,
  [RESOURCE_NAMES.DATASTORE]: Db,
  [RESOURCE_NAMES.FILE]: Archive,
  [RESOURCE_NAMES.GROUP]: Group,
  [RESOURCE_NAMES.HOST]: HardDrive,
  [RESOURCE_NAMES.IMAGE]: BoxIso,
  [RESOURCE_NAMES.MARKETPLACE]: SimpleCart,
  [RESOURCE_NAMES.ONEKS]: XrayView,
  [RESOURCE_NAMES.PROVIDER]: SettingsProfiles,
  [RESOURCE_NAMES.SEC_GROUP]: HistoricShield,
  [RESOURCE_NAMES.SERVICE]: Packages,
  [RESOURCE_NAMES.SERVICE_TEMPLATE]: MultiplePagesEmpty,
  [RESOURCE_NAMES.SUPPORT]: HeadsetHelp,
  [RESOURCE_NAMES.USER]: User,
  [RESOURCE_NAMES.VDC]: List,
  [RESOURCE_NAMES.VM]: ModernTv,
  [RESOURCE_NAMES.VM_GROUP]: Folder,
  [RESOURCE_NAMES.VM_TEMPLATE]: EmptyPage,
  [RESOURCE_NAMES.VNET]: NetworkAlt,
  [RESOURCE_NAMES.VN_TEMPLATE]: NetworkAlt,
  [RESOURCE_NAMES.VROUTER]: Shuffle,
  [RESOURCE_NAMES.VROUTER_TEMPLATE]: Shuffle,
  [RESOURCE_NAMES.ZONE]: MinusPinAlt,
})

/**
 * Returns the icon component associated with a resource.
 *
 * @param {string} resource - Resource id
 * @returns {Function} Icon component
 */
export const getResourceIcon = (resource) =>
  RESOURCE_ICONS[String(resource ?? '').toLowerCase()] ?? NewTab
