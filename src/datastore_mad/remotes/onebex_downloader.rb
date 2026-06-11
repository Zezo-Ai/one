#!/usr/bin/env ruby

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

ONE_LOCATION = ENV['ONE_LOCATION'] unless defined?(ONE_LOCATION)

if !ONE_LOCATION
    RUBY_LIB_LOCATION ||= '/usr/lib/one/ruby'
    GEMS_LOCATION     ||= '/usr/share/one/gems'
    VAR_LOCATION      ||= '/var/lib/one'
else
    RUBY_LIB_LOCATION ||= ONE_LOCATION + '/lib/ruby'
    GEMS_LOCATION     ||= ONE_LOCATION + '/share/gems'
    VAR_LOCATION      ||= ONE_LOCATION + '/var'
end

# %%RUBYGEMS_SETUP_BEGIN%%
require 'load_opennebula_paths'
# %%RUBYGEMS_SETUP_END%%

$LOAD_PATH << RUBY_LIB_LOCATION
$LOAD_PATH << File.dirname(__FILE__)

require 'shellwords'

# onebex://DST_DS_ID:PORT
onebex_url = ARGV[0]
to         = ARGV[1]

begin
    if to.nil? || to.empty?
        raise StandardError, 'Missing destination path for OneBEX writer'
    end

    proto, url = onebex_url.split(%r{://}, 2)

    unless proto == 'onebex' && url
        raise StandardError, "Invalid OneBEX URL: #{onebex_url}"
    end

    _ds, port_s = url.split(':', 2)

    port    = Integer(port_s, 10)
    baddr   = ENV.fetch('ONE_BEX_WRITER_ADDR', '0.0.0.0')
    writer  = File.expand_path('onebex_writer.rb', __dir__)

    raw_to = "#{to}.raw"

    command = [
        writer,
        baddr,
        port.to_s,
        raw_to
    ].shelljoin

    clean_command = [
        'sh',
        '-c',
        "rm -f #{Shellwords.escape(to)} && " \
        'qemu-img convert -f raw -O qcow2 ' \
        "#{Shellwords.escape(raw_to)} #{Shellwords.escape(to)} && " \
        "rm -f #{Shellwords.escape(raw_to)}"
    ].shelljoin

    puts "command=#{Shellwords.escape(command)}"
    puts "clean_command=#{Shellwords.escape(clean_command)}"
rescue StandardError => e
    STDERR.puts e.message
    exit(-1)
end
