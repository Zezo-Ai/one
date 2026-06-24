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
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types'
// eslint-disable-next-line no-unused-vars
import { ReactElement, useMemo } from 'react'
// eslint-disable-next-line no-unused-vars
import { FieldErrors, useFormContext } from 'react-hook-form'

import { RESOURCE_NAMES, T, VirtualNetwork } from '@ConstantsModule'
import { useViews } from '@FeaturesModule'
import Configuration from '@modules/components/Forms/VnTemplate/InstantiateForm/Steps/ExtraConfiguration/configuration'
import Addresses from '@modules/components/Forms/VnTemplate/InstantiateForm/Steps/ExtraConfiguration/addresses'
import Context from '@modules/components/Forms/VnTemplate/InstantiateForm/Steps/ExtraConfiguration/context'
import Security from '@modules/components/Forms/VnTemplate/InstantiateForm/Steps/ExtraConfiguration/security'
import { Translate } from '@modules/components/HOC'
import { BaseTab as Tabs } from '@modules/components/Tabs'

import { SCHEMA } from '@modules/components/Forms/VnTemplate/InstantiateForm/Steps/ExtraConfiguration/schema'
import { Box } from '@mui/material'

/**
 * @typedef {object} TabType
 * @property {string} id - Id will be to use in view yaml to hide/display the tab
 * @property {string} name - Label of tab
 * @property {ReactElement} Content - Content tab
 * @property {object} [icon] - Icon of tab
 * @property {boolean} [immutable] - If `true`, the section will not be displayed whe is updating
 * @property {function(FieldErrors):boolean} [getError] - Returns `true` if the tab contains an error in form
 */

export const STEP_ID = 'extra'

/** @type {TabType[]} */
export const BASE_TABS = [Configuration(STEP_ID), Addresses, Security, Context]

const Content = ({ isUpdate, vnTemplate, oneConfig, adminGroup }) => {
  const {
    formState: { errors },
  } = useFormContext()

  const { getResourceView } = useViews()

  const totalErrors = Object.keys(errors[STEP_ID] ?? {}).length
  const resource = RESOURCE_NAMES.VN_TEMPLATE
  const instantiateTabs = getResourceView(resource)?.['instantiate-tabs'] ?? {}

  const TABS = BASE_TABS.filter(({ id }) => {
    const tab = instantiateTabs[id]

    return tab && tab.enabled
  })

  const tabs = useMemo(
    () =>
      TABS.map(({ Content: TabContent, name, getError, ...section }) => ({
        ...section,
        name,
        label: <Translate word={name} />,
        renderContent: () => (
          <TabContent
            isUpdate={isUpdate}
            oneConfig={oneConfig}
            adminGroup={adminGroup}
            data={vnTemplate}
          />
        ),
        error: getError?.(errors[STEP_ID]),
      })),
    [totalErrors]
  )

  return (
    <Box sx={{ height: 'auto', overflow: 'auto' }}>
      <Tabs addBorder tabs={tabs} />
    </Box>
  )
}

Content.propTypes = {
  isUpdate: PropTypes.bool,
  vnTemplate: PropTypes.object,
  oneConfig: PropTypes.object,
  adminGroup: PropTypes.bool,
}

/**
 * Optional configuration about Virtual network.
 *
 * @param {VirtualNetwork} data - Virtual network
 * @returns {object} Optional configuration step
 */
const ExtraConfiguration = ({ data, oneConfig, adminGroup, ...rest }) => {
  const isUpdate = data?.NAME !== undefined
  const vnTemplate = rest?.dataTemplateExtended ?? {}

  return {
    id: STEP_ID,
    label: T.AdvancedOptions,
    resolver: SCHEMA(isUpdate, oneConfig, adminGroup),
    optionsValidate: { abortEarly: false },
    content: (formProps) =>
      Content({ ...formProps, vnTemplate, isUpdate, oneConfig, adminGroup }),
  }
}

ExtraConfiguration.propTypes = {
  data: PropTypes.any,
  oneConfig: PropTypes.object,
  adminGroup: PropTypes.bool,
}

export default ExtraConfiguration
