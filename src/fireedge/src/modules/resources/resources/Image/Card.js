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

import { T } from '@ConstantsModule'
import { Component, forwardRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  LabelSlot,
  TitleSlot,
  OwnershipSlot,
  MetadataSlot,
} from '@ComponentsV2Module'

import { getImageState, getLabelSlotLabels } from '@ModelsModule'
import { getLockIcon, prettyBytes, timeFromMilliseconds } from '@UtilsModule'

/**
 * VmTemplateCard component displays a VM Template as a card.
 *
 * @param {object} root0 - Params
 * @param {string} root0.NAME - Template name
 * @param {string} root0.ID - Template ID
 * @param {string} root0.GNAME - Group name
 * @param {string} root0.UNAME - Owner name
 * @param {string} root0.REGTIME - Registration time
 * @param {string} root0.LOGO - Template logo path
 * @param {boolean} root0.isSelected - Whether card is selected
 * @param {Function} root0.onCheck - Check handler
 * @param {Function} root0.onClick - Click handler
 * @param {object} ref - Forwarded ref
 * @returns {Component} ImageCard component
 */
export const ImageCard = forwardRef(
  ({ data, isSelected, onCheck, onClick }, ref) => {
    const {
      ID,
      NAME,
      UNAME,
      GNAME,
      REGTIME,
      PERSISTENT,
      DATASTORE,
      RUNNING_VMS,
      SIZE,
    } = data || {}
    const { color: stateColor, name: stateName } = useMemo(
      () => getImageState(data),
      [data]
    )
    const labelSlotLabels = getLabelSlotLabels(data?.LABELS)

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
                  {NAME} {getLockIcon(data)}
                </>
              ),
              status: stateColor,
              statusName: stateName,
            },
          ],
          [
            OwnershipSlot,
            {
              labels: [
                ['ID', ID],
                ['Owner', UNAME],
                ['Group', GNAME],
                [T.Datastore, DATASTORE ?? '-'],
                [T.Persistent, +PERSISTENT ? T.Persistent : T.NonPersistent],
                [T.VMs, RUNNING_VMS],
                [T.Size, `${prettyBytes(+SIZE ?? 0, 'MB')}`],
              ],
            },
          ],
          [
            MetadataSlot,
            {
              labels: [
                [
                  REGTIME &&
                    `${T.Registered} ${timeFromMilliseconds(
                      +REGTIME
                    ).toRelative()}`,
                ]?.filter(Boolean),
              ],
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

ImageCard.propTypes = {
  data: PropTypes.object,
  isSelected: PropTypes.bool,
  onCheck: PropTypes.func,
  onClick: PropTypes.func,
}

ImageCard.displayName = 'ImageCard'
