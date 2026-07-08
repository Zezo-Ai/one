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

import clsx from 'clsx'
import { useState, ReactNode, Component, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { renderIcon } from '@UtilsModule'
import { Box, Menu as MUIMenu, Divider } from '@mui/material'
import { getStyles } from '@modules/componentsv2/primitives/Buttons/Menu/styles'
import { Button } from '@modules/componentsv2/primitives/Buttons/Default'
import { Toggle } from '@modules/componentsv2/primitives/Buttons/Toggle/Single'
import { NavArrowDown } from 'iconoir-react'
import { T, STYLE_BUTTONS } from '@ConstantsModule'

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
export const MenuButton = forwardRef(
  (
    {
      __useToggleTrigger = false,
      endIcon = NavArrowDown,
      iconOnly,
      type,
      isDisabled = false,
      options = [],
      placeholder = T.Options,
      size = 'small',
      sx,
      ...opts
    },
    ref
  ) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleSetAnchor = (e) => setAnchorEl(e.currentTarget)
    const handleClose = () => setAnchorEl(null)

    const isAllOptionsDisabled =
      []
        .concat(options)
        .flat()
        .filter((n) => n && !n.isDisabled)?.length === 0

    const Trigger = __useToggleTrigger ? Toggle : Button

    return (
      <Box className="menu-button-container" ref={ref}>
        <Trigger
          onClick={handleSetAnchor}
          isDisabled={isDisabled || isAllOptionsDisabled}
          size={size}
          {...(__useToggleTrigger
            ? {
                startIcon: iconOnly,
                tooltip: placeholder,
                isSelectable: false,
                isSelected: open,
              }
            : {
                type:
                  type ??
                  (iconOnly
                    ? STYLE_BUTTONS.TYPE.TRANSPARENT
                    : STYLE_BUTTONS.TYPE.SECONDARY),
                endIcon,
                title: placeholder,
                iconOnly,
              })}
        />
        <MUIMenu
          keepMounted={false}
          sx={[
            (theme) =>
              getStyles({
                theme,
              }),
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            style: {
              transform: 'translateY(4px)',
            },
          }}
          open={open}
          onClose={handleClose}
        >
          {options?.flatMap((group, groupIdx) => {
            const items = group.map(
              (
                {
                  title,
                  onClick,
                  startIcon,
                  isDisabled: optionDisabled,
                  ...rest
                },
                idx
              ) => (
                <Box
                  key={`${groupIdx}-${idx}`}
                  className={clsx('menu-button-option', {
                    disabled: isDisabled || optionDisabled,
                  })}
                  onClick={(...args) => {
                    if (isDisabled || optionDisabled) return
                    onClick?.(...args)
                    handleClose()
                  }}
                  {...rest}
                >
                  {startIcon &&
                    renderIcon(startIcon, { className: 'option-starticon' })}
                  {title}
                </Box>
              )
            )

            if (groupIdx < options.length - 1) {
              items.push(
                <Divider
                  key={`divider-${groupIdx}`}
                  orientation="horizontal"
                  flexItem
                  className="menu-group-divider"
                />
              )
            }

            return items
          })}
        </MUIMenu>
      </Box>
    )
  }
)

MenuButton.propTypes = {
  options: PropTypes.array,
  size: PropTypes.string,
  isDisabled: PropTypes.bool,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  endIcon: PropTypes.node,
  iconOnly: PropTypes.node,
  sx: PropTypes.object,

  __useToggleTrigger: PropTypes.bool, // PRIVATE
}

MenuButton.displayName = 'MenuButton'
