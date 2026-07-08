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

/* eslint-disable jsdoc/require-jsdoc */

export const getVirtualRouterVms = ({ VMS } = {}) =>
  [VMS?.ID ?? []].flat().filter((id) => id !== undefined && id !== null)

export const getVirtualRouterNics = ({ TEMPLATE } = {}) =>
  [TEMPLATE?.NIC ?? []]
    .flat()
    .filter(Boolean)
    .map((nic = {}, index) => ({
      ...nic,
      ID: nic.NIC_ID ?? index,
      NIC_ID: nic.NIC_ID ?? index,
      IP: nic.VROUTER_IP ?? nic.IP,
      IP6: nic.VROUTER_IP6 ?? nic.IP6,
      MAC: nic.VROUTER_MAC ?? nic.MAC,
      NETWORK: nic.NETWORK ?? nic.NETWORK_ID,
    }))

export const getVirtualRouterTotalVms = (vrouter) =>
  getVirtualRouterVms(vrouter).length

export const getVirtualRouterTotalNics = (vrouter) =>
  getVirtualRouterNics(vrouter).length

export const getVirtualRouterLocked = ({ LOCK } = {}) => (LOCK ? 'Yes' : 'No')
