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

            # Defines methods to inspect OpenNebula Datastores.
            module Datastore

                def self.get(client, datastore_id)
                    return OpenNebula::Error.new(
                        'Datastore ID cannot be nil', OpenNebula::Error::EACTION
                    ) if datastore_id.nil?

                    datastore = OpenNebula::Datastore.new_with_id(datastore_id, client)

                    rc = datastore.info
                    return rc if OpenNebula.is_error?(rc)

                    datastore
                end

                def self.image?(datastore)
                    type = OpenNebula::Datastore::DATASTORE_TYPES[datastore['TYPE'].to_i]
                    type == 'IMAGE'
                end

                def self.resolve_image_ds(client, cluster, datastore_id = nil)
                    if datastore_id
                        datastore = get(client, datastore_id)
                        return datastore if OpenNebula.is_error?(datastore)
                        return datastore if image?(datastore)

                        return OpenNebula::Error.new(
                            "Datastore #{datastore_id} (#{datastore.name}) is not " \
                            'an IMAGE datastore',
                            OpenNebula::Error::EACTION
                        )
                    end

                    cluster.datastore_ids.each do |ds_id|
                        datastore = get(client, ds_id)
                        return datastore if OpenNebula.is_error?(datastore)
                        return datastore if image?(datastore)
                    end

                    OpenNebula::Error.new(
                        "OpenNebula cluster #{cluster.id} (#{cluster.name}) has no " \
                        'image datastores',
                        OpenNebula::Error::EACTION
                    )
                end

            end

        end

    end

end
