# -------------------------------------------------------------------------- #
# Copyright 2019-2025, OpenNebula Systems S.L.                               #
#                                                                            #
# Licensed under the OpenNebula Software License                             #
# (the "License"); you may not use this file except in compliance with       #
# the License. You may obtain a copy of the License as part of the software  #
# distribution.                                                              #
#                                                                            #
# See https://github.com/OpenNebula/one/blob/master/LICENSE.onsla            #
# (or copy bundled with OpenNebula in /usr/share/doc/one/).                  #
#                                                                            #
# Unless agreed to in writing, software distributed under the License is     #
# distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY   #
# KIND, either express or implied. See the License for the specific language #
# governing permissions and  limitations under the License.                  #
# -------------------------------------------------------------------------- #

module Migrator
    def db_version
        "4.10.3"
    end

    def one_version
        "OpenNebula 4.10.3"
    end

    def up

        init_log_time()

        @db.run "CREATE TABLE IF NOT EXISTS vm_import (deploy_id VARCHAR(128), vmid INTEGER, PRIMARY KEY(deploy_id));"

        log_time()

        return true
    end
end
