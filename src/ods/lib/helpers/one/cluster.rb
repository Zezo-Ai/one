# -------------------------------------------------------------------------- #
# Copyright 2002-2026, OpenNebula Project, OpenNebula Systems                #
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

module OpenNebula

    module DocumentServer

        # Defines methods to manage resources in OpenNebula using the OCA API
        module OneHelper

            # Defines methods to inspect OpenNebula Clusters.
            module Cluster

                def self.get(client, cluster_id)
                    return OpenNebula::Error.new(
                        'Cluster ID cannot be nil', OpenNebula::Error::EACTION
                    ) if cluster_id.nil?

                    cluster = OpenNebula::Cluster.new_with_id(cluster_id, client)

                    rc = cluster.info
                    return rc if OpenNebula.is_error?(rc)

                    cluster
                end

                def self.body(client, cluster_id, downcase: true)
                    cluster = get(client, cluster_id)
                    return cluster if OpenNebula.is_error?(cluster)

                    body = cluster.to_hash['CLUSTER']

                    return OpenNebula::Error.new(
                        "Cannot retrieve OpenNebula cluster body for resource '#{cluster_id}'",
                        OpenNebula::Error::EACTION
                    ) unless body

                    body.deep_symbolize_keys(:downcase => downcase)
                end

            end

        end

    end

end
