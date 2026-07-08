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
import { SubmitButton } from '@ComponentsV2Module'
import { css } from '@emotion/css'
import { VmTemplatesTable } from '@ResourcesModule'
import { useTheme } from '@mui/material'
import { Plus as AddIcon, Settings as SettingsIcon } from 'iconoir-react'
import PropTypes from 'prop-types'
import { memo, ReactElement, useMemo } from 'react'
import { useModalsApi } from '@FeaturesModule'

/**
 * Dashboard Button.
 *
 * @param {object} props - Props
 * @param {boolean} props.access - Access
 * @param {Function} props.action - Action
 * @param {string} props.text - Text
 * @param {ReactElement} props.icon - Icon
 * @returns {ReactElement} Dashboard Button Instantiate
 */
export const DashboardButton = memo(
  ({ access = false, text, action = () => undefined }) =>
    access && (
      <SubmitButton
        onClick={action}
        label={text}
        startIcon={<SettingsIcon />}
      />
    ),
  (prev, next) => prev.access === next.access
)

DashboardButton.propTypes = {
  access: PropTypes.bool,
  text: PropTypes.string,
  action: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
}

DashboardButton.displayName = 'DashboardButton'

const useTableStyles = () => ({
  body: css({
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr)) !important',
  }),
})

/**
 * Dashboard Create VM.
 *
 * @param {object} props - Props
 * @param {Function} props.action - Action
 * @returns {ReactElement} Dashboard Button Instantiate
 */
const DashboardCreateVM = memo(({ action = () => undefined }) => {
  const theme = useTheme()
  const classes = useMemo(() => useTableStyles(theme), [theme])

  return (
    <VmTemplatesTable.Table
      disableGlobalSort
      disableRowSelect
      onRowClick={action}
      classes={classes}
    />
  )
})

DashboardCreateVM.propTypes = {
  action: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
}

DashboardCreateVM.displayName = 'DashboardCreateVM'

/**
 * Dashboard Button Instantiate.
 *
 * @param {object} props - Props
 * @param {boolean} props.access - Access
 * @param {Function} props.action - Action
 * @param {string} props.text - Text
 * @returns {ReactElement} Dashboard Button Instantiate
 */
export const DashboardButtonInstantiate = memo(
  ({ access = false, action, text = '' }) => {
    const { showModal } = useModalsApi()
    const showInstantiateVmForm = () =>
      showModal({
        isConfirmDialog: true,
        dialogProps: {
          title: T.Instantiate,
          children: <DashboardCreateVM action={action} />,
          fixedWidth: true,
          fixedHeight: true,
        },
      })

    return (
      access && (
        <SubmitButton
          startIcon={AddIcon}
          label={text}
          onClick={showInstantiateVmForm}
        />
      )
    )
  }
)

DashboardButtonInstantiate.propTypes = {
  access: PropTypes.bool,
  text: PropTypes.string,
  action: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
}

DashboardButtonInstantiate.displayName = 'DashboardButtonInstantiate'
