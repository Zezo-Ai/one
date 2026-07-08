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

import { ReactNode, Component, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Button as MUIButton } from '@mui/material'
import { getStyles } from '@modules/componentsv2/primitives/Buttons/Default/styles'
import { renderIcon } from '@UtilsModule'

/**
 * @param {object} root0 - Params
 * @param {string} root0.children - Children
 * @param {string} root0.type - Button type
 * @param {string} root0.htmlType - The default button behavior, can be submit, reset or button.
 * @param {boolean} root0.isDisabled - Disable button
 * @param {boolean} root0.isDestructive - Set button style to destructive
 * @param {ReactNode} root0.startIcon - Start icon
 * @param {ReactNode} root0.endIcon - End icon
 * @param {ReactNode} root0.iconOnly - Only icon to render
 * @param {string} root0.title - Button label
 * @param {string} root0.size - Size of button
 * @returns {Component} - Custom MUI Button component
 */
export const Button = forwardRef(
  (
    {
      children,
      type = 'primary',
      htmlType,
      size = 'small',
      startIcon = null,
      endIcon = null,
      iconOnly = null,
      isDisabled = false,
      isDestructive = false,
      ...opts
    },
    ref
  ) => {
    const { sx, ...buttonProps } = opts

    const content =
      renderIcon(iconOnly) || buttonProps?.title || children || 'Button'

    return (
      <MUIButton
        {...buttonProps}
        type={htmlType}
        ref={ref}
        size={size}
        disabled={isDisabled}
        disableRipple
        startIcon={iconOnly ? null : renderIcon(startIcon)}
        endIcon={iconOnly ? null : renderIcon(endIcon)}
        sx={[
          (theme) =>
            getStyles({
              theme,
              type,
              iconOnly: !!iconOnly,
              size,
              isDestructive,
              ...buttonProps,
            }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ].filter(Boolean)}
      >
        {content}
      </MUIButton>
    )
  }
)

Button.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  htmlType: PropTypes.string,
  size: PropTypes.string,
  isDisabled: PropTypes.bool,
  isDestructive: PropTypes.bool,
  iconOnly: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  endIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  startIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  title: PropTypes.string,
}

Button.displayName = 'Button'
