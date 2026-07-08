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
import { Tooltip, Typography } from '@mui/material'
import { memo } from 'react'
import { Button } from '@modules/componentsv2/primitives/Buttons/Default'
import PropTypes from 'prop-types'

export const SubmitButton = memo(
  ({
    isSubmitting,
    isDisabled,
    label,
    title,
    tooltipLink,
    tooltip: tooltipText,
    ...props
  }) => {
    const hasTooltip =
      typeof tooltipText === 'string'
        ? tooltipText.trim().length > 0
        : !!tooltipText

    const buttonContent = (
      <Button
        isDisabled={isDisabled || isSubmitting}
        {...props}
        htmlType="submit"
      >
        {label || title}
      </Button>
    )

    return hasTooltip ? (
      <Tooltip
        arrow
        placement="bottom"
        title={
          tooltipLink ? (
            <Typography variant="subtitle2">
              {tooltipText}
              <a target="_blank" href={tooltipLink.link} rel="noreferrer">
                {tooltipLink.text}
              </a>
            </Typography>
          ) : (
            <Typography variant="subtitle2">{tooltipText}</Typography>
          )
        }
      >
        <span>{buttonContent}</span>
      </Tooltip>
    ) : (
      buttonContent
    )
  },
  (prev, next) =>
    prev.icon === next.icon &&
    prev.isSubmitting === next.isSubmitting &&
    prev.isDisabled === next.isDisabled &&
    prev.label === next.label &&
    prev.onClick === next.onClick
)

const SubmitButtonPropTypes = {
  children: PropTypes.any,
  endIcon: PropTypes.node,
  startIcon: PropTypes.node,
  iconOnly: PropTypes.node,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  tooltipLink: PropTypes.object,
  tooltipprops: PropTypes.object,
  isSubmitting: PropTypes.bool,
  isDisabled: PropTypes.bool,
  variant: PropTypes.string,
}

SubmitButton.propTypes = SubmitButtonPropTypes

SubmitButton.displayName = 'SubmitButton'
