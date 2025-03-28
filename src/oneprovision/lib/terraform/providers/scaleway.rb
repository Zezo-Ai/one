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

#--------------------------------------------------------------------------- #
# This file contains an example of a provider class. You just need to:
#
#   Copy this file to <<PROVIDER>>.rb
#   Replace variables between << >> by the correct value
#   Remove all the unneeded comments
#
# You can check this documentation TODO: add link for more information
#--------------------------------------------------------------------------- #

require 'terraform/terraform'

# Module OneProvision
module OneProvision

    # <<PROVIDER NAME>> Terraform Provider
    class Scaleway < Terraform

        NAME = Terraform.append_provider(__FILE__, name)

        # OpenNebula - Terraform equivalence
        TYPES = {
            :host      => 'scaleway_baremetal_os'
        }

        KEYS = ['access_key', 'secret_key', 'project_id']

        # Class constructor
        #
        # @param provider [Provider]
        # @param state    [String] Terraform state in base64
        # @param conf     [String] Terraform config state in base64
        def initialize(provider, state, conf)
            # If credentials are stored into a file, set this variable to true
            # If not, leave it as it is
            @file_credentials = false

            super
        end

        # Get user data to add into the VM
        #
        # @param ssh_key [String] SSH keys to add
        def user_data(ssh_key)
            user_data = []
            ssh_key.split("\n").each {|key| user_data << key.to_s }

            user_data
        end

    end

end
