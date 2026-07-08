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

import { T, VNET_THRESHOLD } from '@ConstantsModule'
import { Component, forwardRef } from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  LabelSlot,
  MetadataSlot,
  ProgressBarSlot,
  TitleSlot,
} from '@ComponentsV2Module'
import {
  getLabelSlotLabels,
  getLeasesInfo,
  getVirtualNetworkState,
} from '@ModelsModule'

/**
 * VirtualNetworkCard component displays a Virtual Network as a card.
 *
 * @param {object} root0 - Params
 * @param {object} root0.vnet - Virtual Network data
 * @param {boolean} root0.isSelected - Whether card is selected
 * @param {Function} root0.onCheck - Check handler
 * @param {Function} root0.onClick - Click handler
 * @param {object} ref - Forwarded ref
 * @returns {Component} Virtual Network card component
 */
export const VirtualNetworkCard = forwardRef(
  ({ vnet = {}, isSelected, onCheck, onClick }, ref) => {
    const { ID, NAME, UNAME, GNAME, LOCK, VN_MAD, CLUSTERS } = vnet

    const { color: stateColor, name: stateName } =
      getVirtualNetworkState(vnet) ?? {}
    const { percentOfUsed, percentLabel } = getLeasesInfo(vnet)
    const cluster = [CLUSTERS?.ID ?? []].flat()[0]
    const labelSlotLabels = getLabelSlotLabels(vnet?.LABELS)

    return (
      <Card
        ref={ref}
        onCheck={onCheck}
        onClick={onClick}
        isSelected={isSelected}
        slots={[
          [
            TitleSlot,
            {
              title: NAME,
              status: stateColor,
              statusName: stateName,
            },
          ],
          [
            MetadataSlot,
            {
              labels: [
                [T.ID, String(ID)],
                [T.Owner, UNAME],
                [T.Group, GNAME],
                [T.Cluster, cluster],
              ].filter(([, value]) => value),
            },
          ],
          (LOCK || VN_MAD || labelSlotLabels.length > 0) && [
            LabelSlot,
            {
              labels: [
                LOCK && [T.Locked, 'information'],
                VN_MAD && [VN_MAD, 'default'],
                ...labelSlotLabels,
              ].filter(Boolean),
            },
          ],
          [
            ProgressBarSlot,
            {
              bars: [
                {
                  label: `${T.UsedLeases} ${percentLabel}`,
                  size: 'small',
                  value: percentOfUsed,
                  isLabelVisible: true,
                  thresholds: [
                    VNET_THRESHOLD.LEASES.low,
                    VNET_THRESHOLD.LEASES.high,
                  ],
                },
              ],
            },
          ],
        ].filter(Boolean)}
      />
    )
  }
)

VirtualNetworkCard.propTypes = {
  vnet: PropTypes.object,
  isSelected: PropTypes.bool,
  onCheck: PropTypes.func,
  onClick: PropTypes.func,
}

VirtualNetworkCard.displayName = 'VirtualNetworkCard'
