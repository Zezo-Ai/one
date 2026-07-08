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

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * @param {object} params - Params
 * @param {any} params.value - Controlled value; undefined = uncontrolled
 * @param {any} params.defaultValue - Initial value for uncontrolled mode
 * @param {Function} params.onChange - Called with next value on every change
 * @returns {Function} [currentValue, setValue]
 */
const useControllableState = ({ value, defaultValue, onChange }) => {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = value !== undefined

  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const internalValueRef = useRef(internalValue)
  internalValueRef.current = internalValue

  const setValue = useCallback(
    (next) => {
      const nextValue =
        typeof next === 'function'
          ? next(isControlled ? value : internalValueRef.current)
          : next
      if (!isControlled) setInternalValue(nextValue)
      onChangeRef.current?.(nextValue)
    },
    [isControlled, value]
  )

  return [isControlled ? value : internalValue, setValue]
}

export default useControllableState
