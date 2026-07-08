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
  MetadataSlot,
  OwnershipSlot,
  TitleSlot,
} from '@ComponentsV2Module'
import {
  getBackupRunningVms,
  getImageState,
  getImageType,
  getLabelSlotLabels,
} from '@ModelsModule'
import { prettyBytes, timeFromMilliseconds } from '@UtilsModule'

/**
 * @param {object} root0 - Params
 * @param {object} root0.data - Backup data
 * @param {boolean} root0.isSelected - Whether card is selected
 * @param {Function} root0.onCheck - Check handler
 * @param {Function} root0.onClick - Click handler
 * @param {object} ref - Forwarded ref
 * @returns {Component} Backup card component
 */
export const BackupCard = forwardRef(
  ({ data, isSelected, onCheck, onClick }, ref) => {
    const { ID, NAME, UNAME, GNAME, REGTIME, PERSISTENT, DATASTORE, SIZE } =
      data || {}

    const { color: stateColor, name: stateName } = useMemo(
      () => getImageState(data),
      [data]
    )

    const type = useMemo(() => getImageType(data), [data])
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
              title: NAME,
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
                [T.Type, type],
                [T.Persistent, +PERSISTENT ? T.Persistent : T.NonPersistent],
                [T.VMs, getBackupRunningVms(data)],
                [T.Size, `${prettyBytes(+SIZE || 0, 'MB')}`],
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

BackupCard.propTypes = {
  data: PropTypes.object,
  isSelected: PropTypes.bool,
  onCheck: PropTypes.func,
  onClick: PropTypes.func,
}

BackupCard.displayName = 'BackupCard'
