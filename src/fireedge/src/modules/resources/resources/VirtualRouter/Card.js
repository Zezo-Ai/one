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

import { Component, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { T } from '@ConstantsModule'
import { Card, LabelSlot, MetadataSlot, TitleSlot } from '@ComponentsV2Module'
import {
  getLabelSlotLabels,
  getVirtualRouterTotalNics,
  getVirtualRouterTotalVms,
} from '@ModelsModule'
import { getLockIcon } from '@UtilsModule'

/**
 * VirtualRouterCard component displays a Virtual Router as a card.
 *
 * @param {object} root0 - Params
 * @param {object} root0.vrouter - Virtual Router data
 * @param {boolean} root0.isSelected - Whether card is selected
 * @param {Function} root0.onCheck - Check handler
 * @param {Function} root0.onClick - Click handler
 * @param {object} ref - Forwarded ref
 * @returns {Component} Virtual Router card component
 */
export const VirtualRouterCard = forwardRef(
  ({ vrouter = {}, isSelected, onCheck, onClick }, ref) => {
    const { ID, NAME, UNAME, GNAME, TEMPLATE_ID } = vrouter
    const labelSlotLabels = getLabelSlotLabels(vrouter?.LABELS)

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
              title: (
                <>
                  {NAME} {getLockIcon(vrouter)}
                </>
              ),
            },
          ],
          [
            MetadataSlot,
            {
              labels: [
                [T.ID, String(ID)],
                [T.Owner, UNAME],
                [T.Group, GNAME],
                [`${T.Template} ${T.ID}`, TEMPLATE_ID],
                [T.TotalVms, String(getVirtualRouterTotalVms(vrouter) ?? 0)],
                [T.NIC, String(getVirtualRouterTotalNics(vrouter) ?? 0)],
              ].filter(([, value]) => value !== undefined && value !== null),
            },
          ],
          labelSlotLabels.length > 0 && [
            LabelSlot,
            {
              labels: labelSlotLabels,
            },
          ],
        ].filter(Boolean)}
      />
    )
  }
)

VirtualRouterCard.propTypes = {
  vrouter: PropTypes.object,
  isSelected: PropTypes.bool,
  onCheck: PropTypes.func,
  onClick: PropTypes.func,
}

VirtualRouterCard.displayName = 'VirtualRouterCard'
