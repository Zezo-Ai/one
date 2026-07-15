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
  stringToBoolean,
  createTable,
  getLockIcon,
  timeFromMilliseconds,
  prettyBytes,
} from '@UtilsModule'
import { Box } from '@mui/material'
import { VmAPI, HostAPI, ImageAPI, DatastoreAPI } from '@FeaturesModule'
import {
  getBackupList,
  getDisks,
  getHistoryAction,
  getHistoryRecords,
  getIps,
  getLastHistory,
  getNics,
  getPcis,
  getSnapshotList,
  getScheduleActions,
  getVirtualMachineState,
  getVirtualMachineType,
} from '@modules/models/VirtualMachine/general'
import { getRepeatInformation } from '@modules/models/Scheduler/general'
import { getDiskType, getDiskName } from '@modules/models/Image/general'
import { getPciDevices } from '@modules/models/Host/general'
import {
  T,
  UNITS,
  DEFAULT_TIMESTAMP_FORMAT,
  STATIC_FILES_URL,
  DEFAULT_TEMPLATE_LOGO,
} from '@ConstantsModule'
import { Image, StatusTag, Tag } from '@ComponentsV2Module'
import { createLabelColumn } from '@modules/models/labels'

/* eslint-disable jsdoc/require-jsdoc */
export const VM_COLUMNS = [
  { header: T.ID, id: 'id', accessorKey: 'ID', width: '5%' },
  {
    header: T.Name,
    id: 'name',
    accessorKey: 'NAME',
    cell: ({ row }) => {
      const logo =
        row?.original?.USER_TEMPLATE?.LOGO ??
        row?.original?.USER_TEMPLATE?.USER_TEMPLATE?.LOGO ??
        row?.original?.TEMPLATE?.LOGO ??
        DEFAULT_TEMPLATE_LOGO
      const src = `${STATIC_FILES_URL}/${logo}`

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Image
            src={src}
            width={32}
            height={32}
            alt={'list-image-identifier'}
          />
          <span>{row.original?.NAME}</span>
          {getLockIcon(row.original)}
        </Box>
      )
    },
  },
  {
    header: T.State,
    id: 'state',
    accessorFn: (row) => getVirtualMachineState(row)?.name,
    cell: ({ row }) => {
      const { color, name } = getVirtualMachineState(row.original) ?? {}

      return <StatusTag statusColor={color} statusName={name} />
    },
  },
  { header: T.Type, id: 'type', accessorFn: getVirtualMachineType },
  {
    header: `${T.CPU} / ${T.VCPU}`,
    id: 'cpu',
    cell: ({ row }) => {
      const { CPU = 1, VCPU = 1 } = row?.original?.TEMPLATE

      return `${CPU}/${VCPU || CPU}`
    },
  },
  {
    header: T.Memory,
    id: 'memory',
    cell: ({ row }) =>
      prettyBytes(row?.original?.TEMPLATE?.MEMORY ?? 0, UNITS.MB),
  },
  {
    header: T.IP,
    id: 'ips',
    accessorFn: (row) => getIps(row).join(),
  },
  {
    header: T.Host,
    id: 'hostname',
    accessorFn: (row) => getLastHistory(row)?.HOSTNAME,
  },
  { header: T.Owner, id: 'owner', accessorKey: 'UNAME' },
  { header: T.Group, id: 'group', accessorKey: 'GNAME' },
  {
    header: T.StartTime,
    id: 'time',
    cell: ({ row }) => timeFromMilliseconds(row.original.STIME).toRelative(),
  },
  createLabelColumn(),
]

export const VM_DISK_COLUMNS = [
  { header: T.ID, id: 'id', accessorKey: 'DISK_ID' },
  {
    width: '15%',
    header: T.Name,
    id: 'name',
    accessorFn: (row) => getDiskName(row) ?? '-',
  },

  { header: T.DiskType, id: 'type', accessorKey: 'DISK_TYPE' },
  {
    header: T.TargetDevice,
    id: 'target',
    accessorKey: 'TARGET',
  },
  {
    header: `${T.Use}`,
    id: 'diskuse',
    cell: ({ row }) => {
      const { SIZE = 0, MONITOR_SIZE = 0 } = row?.original ?? {}

      return `${+SIZE ? prettyBytes(+SIZE, 'MB') : '-'}/${
        +MONITOR_SIZE ? prettyBytes(+MONITOR_SIZE, 'MB') : '-'
      }`
    },
  },
  {
    header: T.Datastore,
    id: 'datastore',
    accessorKey: 'DATASTORE',
  },
  { header: T.Filesystem, id: 'fs', accessorKey: 'FS' },
  { header: 'TM MAD', id: 'tm_mad', accessorKey: 'TM_MAD' },
  {
    header: T.Driver,
    id: 'driver',
    accessorKey: 'DRIVER',
  },
  {
    header: T.Snapshots,
    id: 'snapshots',
    accessorFn: (row) =>
      [].concat(row?.SNAPSHOTS)?.filter(Boolean)?.length ?? 0,
  },
  {
    header: T.Tags,
    id: 'tags',
    width: '15%',
    cell: ({ row }) => {
      const { READONLY, PERSISTENT, SAVE, CLONE } = row

      const labels = [
        getDiskType(row),
        stringToBoolean(PERSISTENT) && T.Persistent,
        stringToBoolean(READONLY) && T.ReadOnly,
        stringToBoolean(SAVE) && T.Save,
        stringToBoolean(CLONE) && T.Clone,
      ].filter(Boolean)

      return (
        <Box
          sx={{
            display: 'flex',
            gap: '2px',
          }}
        >
          {labels.map((label, idx) => (
            <Tag key={`${label}-${idx}`} status="information" title={label} />
          ))}
        </Box>
      )
    },
  },
]

export const VM_NIC_COLUMNS = [
  { header: T.ID, id: 'id', accessorKey: 'NIC_ID' },
  {
    width: '15%',
    header: T.Name,
    id: 'name',
    accessorKey: 'NAME',
  },
  { header: T.Network, id: 'network', accessorKey: 'NETWORK' },
  {
    header: T.TargetDevice,
    id: 'target',
    accessorKey: 'TARGET',
  },
  {
    header: T.ip,
    id: 'ipv4',
    accessorKey: 'IP',
  },
  { header: T.MAC, id: 'mac', accessorKey: 'MAC' },
  { header: 'VN MAD', id: 'vn_mad', accessorKey: 'VN_MAD' },
]

export const VM_PCI_COLUMNS = [
  { header: T.ID, id: 'id', accessorKey: 'PCI_ID', width: '10%' },
  {
    width: '30%',
    header: T.Name,
    id: 'name',
    accessorKey: 'DEVICE_NAME',
  },
  {
    header: T.Vendor,
    id: 'vendor',
    accessorKey: 'VENDOR_NAME',
    width: '25%',
  },
  {
    header: T.Class,
    id: 'class',
    accessorKey: 'CLASS_NAME',
    width: '25%',
  },
  {
    header: T.NumaNode,
    id: 'numa_node_id',
    accessorKey: 'NUMA_NODE',
    width: '10%',
  },
]

export const VM_SNAPSHOT_COLUMNS = [
  { header: T.ID, id: 'id', accessorKey: 'SNAPSHOT_ID', width: '10%' },
  {
    width: '30%',
    header: T.Name,
    id: 'name',
    accessorKey: 'NAME',
  },
  {
    header: T.Created,
    id: 'time',
    cell: ({ row }) =>
      row.original?.TIME
        ? timeFromMilliseconds(+row.original.TIME).toRelative()
        : '-',
  },
  {
    header: T.SystemDiskSize,
    id: 'system_disk_size',
    width: '20%',
    cell: ({ row }) =>
      prettyBytes(row.original?.SYSTEM_DISK_SIZE ?? 0, UNITS.MB),
  },
]

export const VM_BACKUP_COLUMNS = [
  { header: T.ID, id: 'id', accessorKey: 'ID', width: '5%' },
  {
    width: '20%',
    header: T.Name,
    id: 'name',
    accessorKey: 'NAME',
  },
  {
    header: T.Created,
    id: 'regtime',
    width: '20%',
    cell: ({ row }) =>
      row.original?.REGTIME
        ? timeFromMilliseconds(+row.original.REGTIME).toRelative()
        : '-',
  },
  {
    header: T.Datastore,
    id: 'datastore',
    width: '20%',
    accessorKey: 'DATASTORE',
  },
  {
    header: T.Type,
    id: 'backupType',
    accessorFn: (row) =>
      row?.BACKUP_INCREMENTS?.INCREMENT ? T.Incremental : T.Full,
    width: '10%',
  },
  {
    header: T.Size,
    id: 'size',
    width: '10%',
    cell: ({ row }) => prettyBytes(row.original?.SIZE ?? 0, UNITS.MB),
  },
  {
    header: T.Owner,
    id: 'owner',
    width: '10%',
    accessorKey: 'UNAME',
  },
  {
    header: T.Group,
    id: 'group',
    width: '10%',
    accessorKey: 'GNAME',
  },
  {
    header: T.Persistent,
    id: 'persistent',
    width: '10%',
    cell: ({ row }) => (+row?.original?.PERSISTENT ? T.Yes : T.No),
  },
  createLabelColumn(),
]

export const VM_HISTORY_COLUMNS = [
  {
    header: T.Sequence,
    id: 'seq',
    accessorKey: 'SEQ',
    width: '7%',
  },
  {
    header: T.Action,
    id: 'action',
    accessorFn: (row) => getHistoryAction(row?.ACTION) ?? T.Unknown,
    width: '13%',
  },
  {
    header: T.Host,
    id: 'hostname',
    accessorKey: 'HOSTNAME',
    width: '15%',
  },
  {
    header: T.Datastore,
    id: 'datastore',
    accessorKey: 'DATASTORE',
    width: '15%',
  },
  {
    header: T.Started,
    id: 'stime',
    width: '12%',
    cell: ({ row }) =>
      row.original?.STIME
        ? timeFromMilliseconds(+row.original.STIME).toFormat(
            DEFAULT_TIMESTAMP_FORMAT
          )
        : '-',
  },
  {
    header: T.Ended,
    id: 'etime',
    width: '12%',
    cell: ({ row }) =>
      row.original?.ETIME && +row.original.ETIME > 0
        ? timeFromMilliseconds(+row.original.ETIME).toFormat(
            DEFAULT_TIMESTAMP_FORMAT
          )
        : T.Running,
  },
  {
    header: T.Duration,
    id: 'duration',
    width: '8%',
    cell: ({ row }) => {
      const start = +row.original?.STIME
      const end = +row.original?.ETIME || Math.floor(Date.now() / 1000)

      if (!start) return '-'

      const {
        days = 0,
        hours = 0,
        minutes = 0,
      } = timeFromMilliseconds(end)
        .diff(timeFromMilliseconds(start), ['days', 'hours', 'minutes'])
        .toObject()

      return (
        [
          days > 0 && `${days}d`,
          hours > 0 && `${hours}h`,
          Math.floor(minutes) > 0 && `${Math.floor(minutes)}m`,
        ]
          .filter(Boolean)
          .join(' ') || '<1m'
      )
    },
  },
  {
    header: T.Driver,
    id: 'vmMad',
    accessorKey: 'VM_MAD',
    width: '10%',
  },
  {
    header: 'TM MAD',
    id: 'tmMad',
    accessorKey: 'TM_MAD',
    width: '10%',
  },
]

export const VM_SCHED_ACTION_COLUMNS = [
  {
    header: T.ID,
    id: 'id',
    accessorKey: 'ID',
    width: '5%',
  },
  {
    header: T.Action,
    id: 'action',
    accessorKey: 'ACTION',
    width: '15%',
  },
  {
    header: T.Scheduled,
    id: 'time',
    width: '20%',
    accessorFn: (row) =>
      timeFromMilliseconds(row?.TIME ?? 0).toFormat(DEFAULT_TIMESTAMP_FORMAT),
  },
  {
    header: T.Repeat,
    id: 'repeat',
    width: '10%',
    accessorFn: (row) => getRepeatInformation(row)?.repeat ?? T.Once,
  },
  {
    header: T.Ends,
    id: 'end',
    width: '15%',
    accessorFn: (row) => getRepeatInformation(row)?.end ?? '-',
  },
  {
    header: T.Warning,
    id: 'warning',
    width: '20%',
    accessorFn: (row) =>
      +row?.WARNING ? timeFromMilliseconds(row?.WARNING)?.toRelative() : '-',
  },
  {
    header: T.Status,
    id: 'done',
    width: '15%',
    accessorFn: (row) => (+row.DONE >= 0 ? T.DONE : T.PENDING),
  },
]

export const vmsTable = createTable(VM_COLUMNS, VmAPI.useGetVmsPaginatedQuery, {
  dataCy: 'vms',
})
export const vmdisksTable = createTable(
  VM_DISK_COLUMNS,
  (args, options) =>
    VmAPI.useGetVmQuery(args, {
      ...options,
      selectFromResult: ({ data, isFetching, isLoading }) => ({
        data: getDisks(data),
        isFetching,
        isLoading,
      }),
    }),
  { dataCy: 'vm-disks' }
)
export const vmnicsTable = createTable(
  VM_NIC_COLUMNS,
  (args, options) =>
    VmAPI.useGetVmQuery(args, {
      ...options,
      selectFromResult: ({ data, isFetching, isLoading }) => ({
        data: getNics(data),
        isFetching,
        isLoading,
      }),
    }),
  { dataCy: 'vm-nics' }
)

export const vmpcisTable = createTable(
  VM_PCI_COLUMNS,
  (args, options) => {
    const {
      data: vmPcis,
      isFetching: isFetchingVm,
      isLoading: isLoadingVm,
    } = VmAPI.useGetVmQuery(args, {
      ...options,
      selectFromResult: ({ data, isFetching, isLoading }) => ({
        data: getPcis(data)
          ?.map(({ SHORT_ADDRESS, PCI_ID } = {}) => ({ SHORT_ADDRESS, PCI_ID }))
          ?.filter(Boolean),
        isFetching,
        isLoading,
      }),
    })

    const {
      data: hostPcis,
      isFetching: isFetchingHosts,
      isLoading: isLoadingHosts,
    } = HostAPI.useGetHostsQuery(undefined, {
      ...options,
      skip: options?.skip || !vmPcis,
      selectFromResult: ({ data, isFetching, isLoading }) => ({
        data: []
          .concat(data)
          ?.map(getPciDevices)
          ?.flat()
          ?.map((d) => {
            const vmPci = vmPcis?.find(
              (p) => p?.SHORT_ADDRESS === d?.SHORT_ADDRESS
            )

            return vmPci ? { ...d, PCI_ID: vmPci.PCI_ID } : null
          })
          ?.filter(Boolean),
        isFetching,
        isLoading,
      }),
    })

    return {
      data: hostPcis,
      isFetching: isFetchingVm || isFetchingHosts,
      isLoading: isLoadingVm || isLoadingHosts,
    }
  },
  { dataCy: 'vm-pcis' }
)

export const vmsnapshotsTable = createTable(
  VM_SNAPSHOT_COLUMNS,
  (args, options) =>
    VmAPI.useGetVmQuery(args, {
      ...options,
      selectFromResult: ({ data, isFetching, isLoading }) => ({
        data: getSnapshotList(data),
        isFetching,
        isLoading,
      }),
    }),
  { dataCy: 'vm-snapshots' }
)

export const vmschedactionsTable = createTable(
  VM_SCHED_ACTION_COLUMNS,
  (args, options) =>
    VmAPI.useGetVmQuery(args, {
      ...options,
      selectFromResult: ({ data, isFetching, isLoading }) => ({
        data: getScheduleActions(data),
        isFetching,
        isLoading,
      }),
    }),
  { dataCy: 'vm-scheduled-actions' }
)

export const vmbackupsTable = createTable(
  VM_BACKUP_COLUMNS,
  (args, options) => {
    const {
      data: vmBackupIds,
      isFetching: isFetchingVm,
      isLoading: isLoadingVm,
    } = VmAPI.useGetVmQuery(args, {
      ...options,
      selectFromResult: ({ data, isFetching, isLoading }) => ({
        data: getBackupList(data),
        isFetching,
        isLoading,
      }),
    })

    const {
      data: backups,
      isFetching: isFetchingImages,
      isLoading: isLoadingImages,
    } = ImageAPI.useGetBackupsQuery(undefined, {
      ...options,
      skip: options?.skip || !vmBackupIds,
      selectFromResult: ({ data, isFetching, isLoading }) => ({
        data: (() =>
          []
            .concat(data)
            ?.filter(({ ID } = {}) => vmBackupIds?.includes(ID))
            ?.filter(Boolean))(),
        isFetching,
        isLoading,
      }),
    })

    return {
      data: backups,
      isFetching: isFetchingVm || isFetchingImages,
      isLoading: isLoadingVm || isLoadingImages,
    }
  },
  { dataCy: 'vm-backups' }
)

export const vmhistoryTable = createTable(
  VM_HISTORY_COLUMNS,
  (args, options) => {
    const {
      data: historyRecords,
      isFetching: isFetchingVm,
      isLoading: isLoadingVm,
    } = VmAPI.useGetVmQuery(args, {
      ...options,
      selectFromResult: ({ data, isFetching, isLoading }) => ({
        data: getHistoryRecords(data),
        isFetching,
        isLoading,
      }),
    })

    const {
      data: historyRecordsWithDatastores,
      isFetching: isFetchingDatastores,
      isLoading: isLoadingDatastores,
    } = DatastoreAPI.useGetDatastoresQuery(undefined, {
      ...options,
      skip: options?.skip || !historyRecords,
      selectFromResult: ({ data, isFetching, isLoading }) => ({
        data: historyRecords
          ?.map((history = {}) => {
            const datastore = []
              .concat(data)
              ?.find(({ ID } = {}) => +ID === +history?.DS_ID)

            return {
              ...history,
              DATASTORE: datastore?.NAME ?? history?.DS_ID,
            }
          })
          ?.filter(Boolean),
        isFetching,
        isLoading,
      }),
    })

    return {
      data: historyRecordsWithDatastores,
      isFetching: isFetchingVm || isFetchingDatastores,
      isLoading: isLoadingVm || isLoadingDatastores,
    }
  },
  { dataCy: 'vm-history' }
)
