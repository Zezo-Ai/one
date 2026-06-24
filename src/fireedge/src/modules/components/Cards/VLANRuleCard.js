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
import { Box, Typography, useTheme } from '@mui/material'
import PropTypes from 'prop-types'
import { ReactElement, memo, useMemo } from 'react'

import MultipleTags from '@modules/components/MultipleTags'
import { rowStyles } from '@modules/components/Tables/styles'

import { Tr } from '@modules/components/HOC'
import { Group, T, VLANRule } from '@ConstantsModule'

const VLANRuleCard = memo(
  /**
   * @param {object} props - Props
   * @param {Group} props.group - Group
   * @param {VLANRule} props.vlanRule - VLANRule
   * @param {number} props.vlanRuleId - VLAN Rule Id
   * @param {ReactElement} [props.actions] - Actions
   * @returns {ReactElement} - Card
   */
  ({ group, vlanRule = {}, vlanRuleId, actions }) => {
    const theme = useTheme()
    const classes = useMemo(() => rowStyles(theme), [theme])

    const { ID, SCOPE, VNTEMPLATE } = vlanRule

    const labels = [
      { text: `${Tr(T.Scope)}: ${SCOPE}`, dataCy: 'scope' },
      VNTEMPLATE && {
        text: `${Tr(T.VNTemplates)}: ${
          VNTEMPLATE === '-1' ? T.All : VNTEMPLATE
        }`,
        dataCy: 'vntemplate',
      },
    ].filter(Boolean)

    return (
      <Box data-cy="vlanrule" className={classes.root}>
        <div className={classes.main}>
          <div className={classes.title}>
            <Typography noWrap component="span" data-cy="id">
              {`#${vlanRuleId ?? '-'}`}
            </Typography>
            <span className={classes.labels}>
              <MultipleTags tags={labels} limitTags={labels.length} />
            </span>
          </div>
          <Box
            className={classes.caption}
            sx={{
              flexDirection: 'column',
              alignItems: 'flex-start !important',
              gap: '0.5em !important',
            }}
          >
            {ID && (
              <span data-cy="vlan_id" title={'title'}>{`${SCOPE}: ${ID}`}</span>
            )}
          </Box>
        </div>
        <div className={classes.primary}>
          {actions && <div className={classes.actions}>{actions}</div>}
        </div>
      </Box>
    )
  }
)

VLANRuleCard.propTypes = {
  group: PropTypes.object,
  vlanRule: PropTypes.object,
  vlanRuleId: PropTypes.number,
  actions: PropTypes.node,
}

VLANRuleCard.displayName = 'VLANRuleCard'

export default VLANRuleCard
