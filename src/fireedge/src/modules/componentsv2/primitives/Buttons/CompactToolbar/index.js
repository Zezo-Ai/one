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

import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import { MoreVert } from 'iconoir-react'
import { MenuButton } from '@modules/componentsv2/primitives/Buttons/Menu'
import { STYLE_BUTTONS, T } from '@ConstantsModule'
import { CompactToolbarContext } from '@modules/componentsv2/primitives/Buttons/CompactToolbar/context'

const optionSignature = ({
  title,
  text,
  tooltip,
  placeholder,
  isDisabled,
  isDestructive,
  isSelected,
  options,
} = {}) =>
  JSON.stringify({
    title,
    text,
    tooltip,
    placeholder,
    isDisabled,
    isDestructive,
    isSelected,
    options: []
      .concat(options ?? [])
      .flat()
      .filter(Boolean)
      .map(optionSignature),
  })

const getAvailableWidth = (node) => node?.clientWidth ?? 0

/**
 * Toolbar wrapper that moves registered compactable actions to an overflow menu.
 *
 * @param {object} root0 - Params.
 * @param {*} root0.children - Toolbar content.
 * @returns {*} Compact toolbar.
 */
export const CompactToolbar = ({ children }) => {
  const rootRef = useRef(null)
  const contentRef = useRef(null)
  const overflowRef = useRef(null)
  const childrenRef = useRef(children)
  const [overflowSlotCount, setOverflowSlotCount] = useState(0)
  const failedExpandedRef = useRef(null)
  const actionsRef = useRef(new Map())
  const signaturesRef = useRef(new Map())
  const [version, setVersion] = useState(0)
  const [compactedCount, setCompactedCount] = useState(0)

  const orderedActions = useMemo(
    () => [...actionsRef.current.entries()],
    [version]
  )
  const compactedIds = useMemo(
    () =>
      new Set(
        (compactedCount ? orderedActions.slice(0, compactedCount) : []).map(
          ([id]) => id
        )
      ),
    [compactedCount, orderedActions]
  )
  const compactedOptions = useMemo(
    () =>
      orderedActions
        .filter(([id]) => compactedIds.has(id))
        .map(([, action]) => action),
    [compactedIds, orderedActions]
  )

  const registerAction = useCallback((id, action) => {
    const actions = actionsRef.current
    const signatures = signaturesRef.current
    const signature = optionSignature(action)
    const hasAction = actions.has(id)
    const hasChanged = signatures.get(id) !== signature
    const hasActionRefChanged = actions.get(id) !== action

    actions.set(id, action)
    signatures.set(id, signature)

    if (!hasAction || hasChanged || hasActionRefChanged) {
      failedExpandedRef.current = null
      setVersion((current) => current + 1)
    }

    return () => {
      actions.delete(id)
      signatures.delete(id)
      failedExpandedRef.current = null
      setCompactedCount((current) => Math.min(current, actions.size))
      setVersion((current) => current + 1)
    }
  }, [])

  const isCompacted = useCallback((id) => compactedIds.has(id), [compactedIds])
  const hasOverflowSlot = overflowSlotCount > 0
  const registerOverflowSlot = useCallback(() => {
    setOverflowSlotCount((current) => current + 1)

    return () => setOverflowSlotCount((current) => Math.max(0, current - 1))
  }, [])

  const context = useMemo(
    () => ({
      registerAction,
      isCompacted,
      compactedOptions,
      overflowRef,
      registerOverflowSlot,
    }),
    [compactedOptions, isCompacted, registerAction, registerOverflowSlot]
  )

  const compactUntilFits = useCallback(() => {
    const node = rootRef.current
    const content = contentRef.current
    const overflow = overflowRef.current
    const availableNode = node?.parentElement ?? node
    const actionCount = actionsRef.current.size

    if (!node || !content || !actionCount) {
      setCompactedCount(0)

      return
    }

    const availableWidth = getAvailableWidth(availableNode)

    setCompactedCount((current) => {
      const failedExpanded = failedExpandedRef.current
      const canRetryExpand =
        !failedExpanded ||
        failedExpanded.count !== current - 1 ||
        availableWidth > failedExpanded.width + 1
      const rootStyle = window.getComputedStyle(node)
      const gap =
        overflow && !hasOverflowSlot ? parseFloat(rootStyle.columnGap) || 0 : 0
      const requiredWidth =
        content.scrollWidth +
        (hasOverflowSlot ? 0 : overflow?.offsetWidth ?? 0) +
        gap

      if (requiredWidth > availableWidth + 1 && current < actionCount) {
        failedExpandedRef.current = {
          count: current,
          width: availableWidth,
        }

        return current + 1
      }

      if (
        current > 0 &&
        requiredWidth <= availableWidth + 1 &&
        canRetryExpand
      ) {
        return current - 1
      }

      return Math.min(current, actionCount)
    })
  }, [hasOverflowSlot])

  useLayoutEffect(() => {
    if (childrenRef.current !== children) {
      childrenRef.current = children
      failedExpandedRef.current = null
    }

    compactUntilFits()
  }, [children, compactUntilFits, compactedCount, version])

  useEffect(() => {
    const node = rootRef.current
    if (!node) return undefined

    const availableNode = node.parentElement ?? node
    const layoutNode = availableNode.parentElement
    const observedNodes = [
      layoutNode,
      availableNode,
      node,
      contentRef.current,
    ].filter(Boolean)
    let previousWidth = getAvailableWidth(availableNode)
    let previousLayoutWidth = getAvailableWidth(layoutNode)
    let inputFrame
    const handleLayoutInput = () => {
      cancelAnimationFrame(inputFrame)
      inputFrame = requestAnimationFrame(() => {
        failedExpandedRef.current = null
        compactUntilFits()
      })
    }
    const observer = new ResizeObserver(() => {
      const nextWidth = getAvailableWidth(availableNode)
      const nextLayoutWidth = getAvailableWidth(layoutNode)

      if (
        nextWidth !== previousWidth ||
        nextLayoutWidth !== previousLayoutWidth
      ) {
        failedExpandedRef.current = null
      }

      previousWidth = nextWidth
      previousLayoutWidth = nextLayoutWidth
      compactUntilFits()
    })

    observedNodes.forEach((observedNode) => observer.observe(observedNode))
    layoutNode?.addEventListener('input', handleLayoutInput)

    return () => {
      observer.disconnect()
      layoutNode?.removeEventListener('input', handleLayoutInput)
      cancelAnimationFrame(inputFrame)
    }
  }, [compactUntilFits])

  return (
    <CompactToolbarContext.Provider value={context}>
      <Box
        className="compact-toolbar"
        ref={rootRef}
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: `${theme.scale[500]}px`,
          minWidth: 0,
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
        })}
      >
        <Box
          className="compact-toolbar-content"
          ref={contentRef}
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'nowrap',
            gap: `${theme.scale[500]}px`,
            flex: '0 1 auto',
            width: 'auto',
            minWidth: 0,
            maxWidth: '100%',
            overflow: 'hidden',
          })}
        >
          {children}
        </Box>
        {!!compactedOptions.length && !hasOverflowSlot && (
          <Box
            className="compact-toolbar-overflow"
            ref={overflowRef}
            sx={{
              display: 'flex',
              flex: '0 0 auto',
            }}
          >
            <MenuButton
              iconOnly={<MoreVert width="16px" height="16px" />}
              placeholder={T.More}
              size="medium"
              type={STYLE_BUTTONS.TYPE.SECONDARY}
              options={[compactedOptions]}
              nestedTrigger="hover"
            />
          </Box>
        )}
      </Box>
    </CompactToolbarContext.Provider>
  )
}

CompactToolbar.propTypes = {
  children: PropTypes.node,
}

/**
 * Optional placement for the compact toolbar overflow menu.
 *
 * @param {object} root0 - Params.
 * @param {boolean} root0.useToggleTrigger - Render as a toggle-group item.
 * @param {string} root0.size - Button size.
 * @param {boolean} root0.isDisabled - Disable overflow menu.
 * @returns {*} Overflow menu placement.
 */
export const CompactToolbarOverflow = ({
  useToggleTrigger = false,
  size = 'medium',
  isDisabled = false,
}) => {
  const context = useContext(CompactToolbarContext)
  const {
    compactedOptions = [],
    overflowRef,
    registerOverflowSlot,
  } = context ?? {}

  useLayoutEffect(() => {
    if (!registerOverflowSlot) return undefined

    return registerOverflowSlot()
  }, [registerOverflowSlot])

  if (!compactedOptions.length) return null

  return (
    <Box
      className="compact-toolbar-overflow"
      ref={overflowRef}
      sx={{
        display: 'flex',
        flex: '0 0 auto',
      }}
    >
      <MenuButton
        iconOnly={<MoreVert width="16px" height="16px" />}
        placeholder={T.More}
        size={size}
        type={STYLE_BUTTONS.TYPE.SECONDARY}
        isDisabled={isDisabled}
        options={[compactedOptions]}
        nestedTrigger="hover"
        __useToggleTrigger={useToggleTrigger}
      />
    </Box>
  )
}

CompactToolbarOverflow.propTypes = {
  useToggleTrigger: PropTypes.bool,
  size: PropTypes.string,
  isDisabled: PropTypes.bool,
}
