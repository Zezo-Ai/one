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

export const DASHBOARD_CARD_IDS = {
  VIRTUAL_MACHINES: 'virtual-machines',
  HOSTS_SUMMARY: 'hosts-summary',
  VIRTUAL_NETWORKS: 'virtual-networks',
  IMAGES: 'images',
  HOSTS: 'hosts',
  CPU_CHART: 'cpu-chart',
  MEMORY_CHART: 'memory-chart',
  HOST_CPU_CHART: 'host-cpu-chart',
  HOST_MEMORY_CHART: 'host-memory-chart',
  CLUSTER_CAPACITY: 'cluster-capacity',
  SYSTEM: 'system',
}

const DASHBOARD_CARD_SIZES = [
  'quarter',
  'third',
  'half',
  'full',
  'wide',
  'narrow',
]

export const DEFAULT_DASHBOARD_CARDS = [
  {
    id: DASHBOARD_CARD_IDS.VIRTUAL_MACHINES,
    order: 10,
    size: 'quarter',
    to: true,
  },
  {
    id: DASHBOARD_CARD_IDS.HOSTS_SUMMARY,
    order: 20,
    size: 'quarter',
    to: true,
  },
  {
    id: DASHBOARD_CARD_IDS.VIRTUAL_NETWORKS,
    order: 30,
    size: 'quarter',
    to: true,
  },
  {
    id: DASHBOARD_CARD_IDS.IMAGES,
    order: 40,
    size: 'quarter',
    to: true,
  },
  {
    id: DASHBOARD_CARD_IDS.HOSTS,
    order: 50,
    size: 'full',
    to: true,
  },
  {
    id: DASHBOARD_CARD_IDS.CLUSTER_CAPACITY,
    order: 60,
    size: 'wide',
    to: false,
  },
  {
    id: DASHBOARD_CARD_IDS.SYSTEM,
    order: 70,
    size: 'narrow',
    to: true,
  },
]

const DASHBOARD_CARD_DEFINITIONS = [
  ...DEFAULT_DASHBOARD_CARDS,
  {
    id: DASHBOARD_CARD_IDS.CPU_CHART,
    order: 80,
    size: 'half',
    to: false,
  },
  {
    id: DASHBOARD_CARD_IDS.MEMORY_CHART,
    order: 90,
    size: 'half',
    to: false,
  },
  {
    id: DASHBOARD_CARD_IDS.HOST_CPU_CHART,
    order: 100,
    size: 'half',
    to: false,
  },
  {
    id: DASHBOARD_CARD_IDS.HOST_MEMORY_CHART,
    order: 110,
    size: 'half',
    to: false,
  },
]

const DEFAULT_CARDS_BY_ID = Object.fromEntries(
  DASHBOARD_CARD_DEFINITIONS.map((card) => [card.id, card])
)

/**
 * Normalizes dashboard cards loaded from the active view configuration.
 *
 * Missing configuration falls back to the complete dashboard. An explicitly
 * empty array intentionally hides every card.
 *
 * @param {object[]} cards - Cards from dashboard-tab.yaml
 * @returns {object[]} Valid, unique cards sorted by configured order
 */
export const getDashboardCards = (cards) => {
  const configuredCards = Array.isArray(cards) ? cards : DEFAULT_DASHBOARD_CARDS
  const seenCards = new Set()

  return configuredCards
    .reduce((normalizedCards, card, index) => {
      const id = String(card?.id ?? '').toLowerCase()
      const defaults = DEFAULT_CARDS_BY_ID[id]

      if (!defaults || seenCards.has(id)) return normalizedCards

      seenCards.add(id)

      const configuredOrder = Number(card.order)

      normalizedCards.push({
        id,
        order: Number.isFinite(configuredOrder)
          ? configuredOrder
          : defaults.order,
        size: DASHBOARD_CARD_SIZES.includes(card.size)
          ? card.size
          : defaults.size,
        to: typeof card.to === 'boolean' ? card.to : defaults.to,
        configIndex: index,
      })

      return normalizedCards
    }, [])
    .sort(
      (firstCard, secondCard) =>
        firstCard.order - secondCard.order ||
        firstCard.configIndex - secondCard.configIndex
    )
    .map(({ configIndex, ...card }) => card)
}
