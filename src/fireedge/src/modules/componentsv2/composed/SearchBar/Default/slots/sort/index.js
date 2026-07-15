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

import { forwardRef, Component, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Box, Popper } from '@mui/material'
import {
  getStyles,
  getPopperStyles,
} from '@modules/componentsv2/composed/SearchBar/Default/slots/sort/styles'
import { Dropdown } from '@modules/componentsv2/primitives/Dropdown'
import { Sort as SortIcon, SortDown, SortUp } from 'iconoir-react'

const SortPopper = forwardRef(
  (
    { style: { width: anchorWidth, ...style } = {}, sortLabel = '', ...props },
    ref
  ) => (
    <Popper
      {...props}
      ref={ref}
      placement="bottom-start"
      style={{
        ...style,
        minWidth:
          typeof anchorWidth === 'number' ? `${anchorWidth}px` : anchorWidth,
      }}
      sx={(theme) => getPopperStyles({ theme, label: sortLabel })}
    />
  )
)

SortPopper.propTypes = {
  sortLabel: PropTypes.string,
  style: PropTypes.object,
}

SortPopper.displayName = 'SortPopper'

/**
 * SortSlot component.
 *
 * @param {object} root0 - Params
 * @param {string} root0.label - Label text
 * @param {string} root0.hint - Hint text
 * @param {object} root0.children - Child elements
 * @param {string} root0.initialValue - Initial value
 * @returns {Component} - TextField component
 */
export const SortSlot = forwardRef(
  (
    {
      placeholder = 'Sort',
      sortIcon = SortIcon,
      options = [],
      initialValue,
      sortDesc = false,
      onChange,
    },
    ref
  ) => {
    const longestLabel = [placeholder, initialValue, ...options]
      .map((option) =>
        String((typeof option === 'object' ? option?.text : option) ?? '')
      )
      .reduce(
        (longest, label) => (label.length > longest.length ? label : longest),
        ''
      )
    const PopperComponent = useMemo(
      () =>
        forwardRef(function SortSlotPopper(props, popperRef) {
          return (
            <SortPopper {...props} ref={popperRef} sortLabel={longestLabel} />
          )
        }),
      [longestLabel]
    )
    const selectedValue =
      typeof initialValue === 'object'
        ? initialValue?.value ?? initialValue?.text
        : initialValue
    const sortOptions = useMemo(
      () =>
        options.map((option) => {
          const optionValue =
            typeof option === 'object' ? option?.value ?? option?.text : option
          const isSelected =
            selectedValue != null &&
            String(optionValue) === String(selectedValue)

          if (!isSelected) return option

          const DirectionIcon = sortDesc ? SortDown : SortUp

          return {
            ...(typeof option === 'object'
              ? option
              : { text: option, value: optionValue }),
            startIcon: (
              <DirectionIcon width="16px" height="16px" strokeWidth={1.6} />
            ),
          }
        }),
      [options, selectedValue, sortDesc]
    )
    const handleChange = (option) => {
      if (option && typeof option === 'object') {
        const { startIcon, ...sortOption } = option

        onChange?.(sortOption)

        return
      }

      onChange?.(option)
    }

    return (
      <Box
        sx={(theme) =>
          getStyles({
            theme,
          })
        }
        ref={ref}
      >
        <Dropdown
          onChange={handleChange}
          startIcon={sortIcon}
          placeholder={placeholder}
          options={sortOptions}
          initialValue={initialValue}
          PopperComponent={PopperComponent}
          disableCloseOnSelect
        />
      </Box>
    )
  }
)

SortSlot.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  sortIcon: PropTypes.node,
  options: PropTypes.array,
  initialValue: PropTypes.any,
  sortDesc: PropTypes.bool,
}

SortSlot.displayName = 'SortSlot'
