# -------------------------------------------------------------------------- #
# Copyright 2002-2025, OpenNebula Project, OpenNebula Systems                #
#                                                                            #
# Licensed under the Apache License, Version 2.0 (the "License"); you may    #
# not use this file except in compliance with the License. You may obtain    #
# a copy of the License at                                                   #
#                                                                            #
# http://www.apache.org/licenses/LICENSE-2.0                                 #
#                                                                            #
# Unless required by applicable law or agreed to in writing, software        #
# distributed under the License is distributed on an "AS IS" BASIS,          #
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   #
# See the License for the specific language governing permissions and        #
# limitations under the License.                                             #
#--------------------------------------------------------------------------- #

module VNMMAD

    ###########################################################################
    # Module to use as mixin for implementing  VLAN drivers based on special
    # link devices though the Linux kernel features and bridges. It provides
    # common functionality to handle bridges
    ###########################################################################
    class VLANDriver < VNMMAD::VNMDriver

        # Attributes that can be updated on update_nic action
        SUPPORTED_UPDATE = [
            :vlan_id,
            :mtu,
            :phydev
        ]

        def initialize(vm_tpl, xpath_filter, deploy_id = nil)
            super(vm_tpl, xpath_filter, deploy_id)

            @locking = true
        end

        # Activate the driver and creates bridges and tags devices as needed.
        def activate
            lock

            @bridges = list_bridges

            process do |nic|
                @nic = nic

                next if @nic[:phydev].nil?

                # generate the name of the vlan device.
                gen_vlan_dev_name

                # Create the bridge.
                create_bridge(@nic)

                # Setup transparent proxies.
                TProxy.setup_tproxy(@nic, :up)

                # Check that no other vlans are connected to this bridge
                validate_vlan_id if @nic[:conf][:validate_vlan_id]

                # Skip if vlan device is already in the bridge.
                next if @bridges[@nic[:bridge]].include? @nic[:vlan_dev]

                # Create vlan device.
                create_vlan_dev

                # Add vlan device to the bridge.
                LocalCommand.run_sh("#{command(:ip)} link set " \
                    "#{@nic[:vlan_dev]} master #{@nic[:bridge]}")

                @bridges[@nic[:bridge]] << @nic[:vlan_dev]
            end

            unlock

            0
        end

        # This function needs to be implemented by any VLAN driver to
        # create the VLAN device. The device MUST be set up by this function
        def create_vlan_dev
            OpenNebula::DriverLogger.log_error('create_vlan_dev function not implemented.')

            exit(-1)
        end

        # This function needs to be implemented by any VLAN driver to
        # delete the VLAN device. The device MUST be deleted by this function
        def delete_vlan_dev
            OpenNebula::DriverLogger.log_error('delete_vlan_dev function not implemented.')

            exit(-1)
        end

        # Deactivate the driver and delete bridges and tags devices as needed.
        def deactivate
            lock

            # NIC_ALIAS are  not processed, skip
            return 0 if @vm['TEMPLATE/NIC_ALIAS[ATTACH="YES"]/NIC_ID']

            @bridges = list_bridges

            attach_nic_id = @vm['TEMPLATE/NIC[ATTACH="YES"]/NIC_ID']

            return 0 unless @bridges

            process do |nic|
                next if attach_nic_id && attach_nic_id != nic[:nic_id]

                @nic = nic

                next if @nic[:phydev].nil?
                next if @bridges[@nic[:bridge]].nil?

                # Get the name of the vlan device.
                gen_vlan_dev_name

                # Skip if the bridge doesn't exist because it was already
                # deleted (handles last vm with multiple nics on the same
                # vlan)
                next unless @bridges.include? @nic[:bridge]

                # Inserting raw phydev into the bridge is incorrect, but
                # it is possible some user makes that mistake. This might
                # cause that cleanup is not triggered properly, so we do
                # not treat phydev as "guest" on purpose here.
                guests = @bridges[@nic[:bridge]] \
                       - [@nic[:phydev], @nic[:vlan_dev], "#{@nic[:bridge]}b"]

                # Setup transparent proxies.
                TProxy.setup_tproxy(@nic, :down) if guests.count < 1

                # Skip the bridge removal (on demand or when still in use).
                next if @nic[:conf][:keep_empty_bridge] || guests.any?

                # Delete the vlan device.
                delete_vlan_dev

                @bridges[@nic[:bridge]].delete(@nic[:vlan_dev])

                # Delete the bridge.
                LocalCommand.run_sh("#{command(:ip)} link delete #{@nic[:bridge]}")

                @bridges.delete(@nic[:bridge])
            end

            0
        ensure
            unlock
        end

        def update(vnet_id)
            lock

            changes = @vm.changes.select do |k, _|
                SUPPORTED_UPDATE.include?(k)
            end

            return 0 if changes.empty?

            @bridges = list_bridges

            return 0 unless @bridges

            process do |nic|
                next unless Integer(nic[:network_id]) == vnet_id

                next if nic[:phydev].nil?

                # the bridge should already exist as we're updating
                next if @bridges[nic[:bridge]].nil?

                if !changes[:vlan_id].nil? || !changes[:phydev].nil?
                    ####################################################
                    # Remove old VLAN
                    ####################################################
                    @nic = nic.merge(changes)
                    gen_vlan_dev_name

                    if @bridges[@nic[:bridge]].include? @nic[:vlan_dev]
                        delete_vlan_dev
                    end

                    ####################################################
                    # Create new link
                    ####################################################
                    @nic = nic
                    gen_vlan_dev_name

                    # Create vlan device (it ALSO sets the MTU)
                    create_vlan_dev

                    ####################################################
                    # Add new link to the BRIDGE
                    ####################################################
                    LocalCommand.run_sh("#{command(:ip)} link " \
                        "set #{@nic[:vlan_dev]} master #{@nic[:bridge]}")

                elsif changes[:mtu]
                    @nic = nic
                    gen_vlan_dev_name

                    # Update only MTU
                    LocalCommand.run_sh("#{command(:ip)} link " \
                        "set #{@nic[:vlan_dev]} mtu #{@nic[:mtu]}")
                end

                # Changes will affect every VM nic
                return
            end

            0
        ensure
            unlock
        end

        private

        # Generate the name of the vlan device which will be added
        # to the bridge.
        def gen_vlan_dev_name
            @nic[:vlan_dev] = "#{@nic[:phydev]}.#{@nic[:vlan_id]}"
        end

        def list_interface_vlan(_name)
            nil
        end

        def validate_vlan_id
            @bridges[@nic[:bridge]].each do |interface|
                vlan = list_interface_vlan(interface)

                next if !vlan || vlan.to_s == @nic[:vlan_id]

                OpenNebula::DriverLogger.log_error("The interface #{interface} has "\
                    "vlan_id = #{vlan} but the network is configured "\
                    "with vlan_id = #{@nic[:vlan_id]}")

                msg = 'Interface with an incorrect vlan_id is already in '\
                      'the bridge'
                OpenNebula::DriverLogger.report(msg)

                exit(-1)
            end
        end

    end

end
