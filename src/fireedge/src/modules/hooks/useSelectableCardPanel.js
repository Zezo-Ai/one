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
import { useEffect, useState } from 'react'

/**
 * Calculates the next selected index after removing an item.
 *
 * @param {object} params - Calculation params
 * @param {number} params.itemsLength - Current item count
 * @param {number} params.removedIndex - Removed item index
 * @param {number} params.selectedIndex - Current selected index
 * @returns {number} Next selected index
 */
const getNextSelectedIndex = ({ itemsLength, removedIndex, selectedIndex }) => {
  if (itemsLength - 1 === selectedIndex) return selectedIndex - 1
  if (itemsLength === 2) return 0
  if (removedIndex < selectedIndex) return selectedIndex - 1

  return selectedIndex
}

/**
 * Selection state helper for selectable card panels.
 *
 * @param {object} params - Hook params
 * @param {Array} params.items - Selectable items
 * @param {Function} params.onAdd - Add callback
 * @param {Function} params.onRemove - Remove callback
 * @returns {object} Selection state and handlers
 */
export const useSelectableCardPanel = ({ items = [], onAdd, onRemove }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [shift, setShift] = useState(0)

  /**
   * Handles append actions and moves selection to the appended item.
   *
   * @param {Event} event - Click event
   */
  const handleAdd = (event) => {
    event?.stopPropagation?.()
    setSelectedIndex(() => {
      setShift(null)

      return null
    })

    onAdd?.()
  }

  /**
   * Handles remove actions and keeps selection in range.
   *
   * @param {Event} event - Click event
   * @param {number} idx - Removed item index
   */
  const handleRemove = (event, idx) => {
    event.stopPropagation()
    setSelectedIndex((prev) => {
      setShift(
        getNextSelectedIndex({
          itemsLength: items?.length,
          removedIndex: idx,
          selectedIndex: prev,
        })
      )

      return null
    })

    onRemove?.(idx)
  }

  useEffect(() => {
    if (selectedIndex === null) {
      if (shift === null) {
        setSelectedIndex(items?.length - 1)
      } else {
        setSelectedIndex(shift)
      }
    }
  }, [items, selectedIndex, shift])

  return {
    selectedIndex,
    setSelectedIndex,
    handleAdd,
    handleRemove,
  }
}
