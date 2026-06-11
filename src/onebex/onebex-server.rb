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

# rubocop:disable Style/GlobalVars

require_relative 'config/environment'
require_relative 'bex_state'

# --------------------------------------------------------------------------
# OneBEX server state
# --------------------------------------------------------------------------

begin
    module OneBEX

        BEX = BEXState.new

    end

    puts '--------------------------------------'
    puts '     OneBEX Server configuration      '
    puts '--------------------------------------'
    pp OneBEX::BEX.conf
    puts '--------------------------------------'
    puts

    STDOUT.flush
rescue StandardError => e
    STDERR.puts "Error parsing config file #{CONFIGURATION_FILE}: #{e.message}"
    exit 1
end

# --------------------------------------------------------------------------
# OneBEX session state
# --------------------------------------------------------------------------

$onebex_exit_code = 0
$onebex_puma      = nil

def finalize_pending_transfers(message)
    OneBEX::BEX.dispose_transfers.each do |vm_id, transfers|
        next if transfers.empty?

        OneBEX::BEX.warn "Finalizing #{transfers.size} pending " \
                         "transfer(s) for VM #{vm_id}: #{message}"

        transfers.each do |transfer_id, transfer|
            remove = {
                :vm_id       => transfer[:vm_id],
                :transfer_id => transfer[:transfer_id]
            }

            OneBEX::BEX.del_transfer(remove, false) do |xfr|
                begin
                    xfr[:exporter].finish(xfr) if xfr[:exporter]

                    xfr[:status]  = 'finished'
                    xfr[:success] = false
                    xfr[:message] = message

                    OneBEX::BEX.warn "Transfer #{transfer_id} finalized as " \
                                     "failed: #{message}"
                rescue StandardError => e
                    OneBEX::BEX.error 'Failed to finalize transfer ' \
                                      "#{transfer_id}: #{e.message}"

                    OneBEX::BEX.error e.backtrace.join("\n") if e.backtrace
                end
            end
        end
    end
end

# --------------------------------------------------------------------------
# Sinatra app
# --------------------------------------------------------------------------

module OneBEX

    # Sinatra application serving the OneBEX API.
    class OneBEXServer < Sinatra::Base

        set :bind, OneBEX::BEX.conf[:host]
        set :port, OneBEX::BEX.conf[:port]
        set :host_authorization, { :permitted_hosts => [] }

        set :bex, OneBEX::BEX
        set :config, OneBEX::BEX.conf
        set :logger, OneBEX::BEX.logger

        set :dump_errors, true
        set :raise_errors, false
        set :show_exceptions, false

        register OneBEX::AppRoutes

    end

end

# --------------------------------------------------------------------------
# Puma startup
#
# Started by DS drivers. Stops when POST /vms/:vm_id/finish is called.
# --------------------------------------------------------------------------

if __FILE__ == $PROGRAM_NAME
    user_config = OneBEX::BEX.conf[:puma] || {}

    min_threads = user_config[:min_threads] || 1
    max_threads = user_config[:max_threads] || 4

    puma_config = Puma::Configuration.new do |puma|
        puma.app OneBEX::OneBEXServer
        puma.bind "tcp://#{OneBEX::BEX.conf[:host]}:#{OneBEX::BEX.conf[:port]}"
        puma.threads min_threads.to_i, max_threads.to_i
    end

    $onebex_puma = Puma::Launcher.new(puma_config)
    OneBEX::BEX.puma = $onebex_puma

    begin
        OneBEX::BEX.info 'Starting OneBEX server'
        OneBEX::BEX.info "OneBEX Puma config: bind=#{OneBEX::BEX.conf[:host]}:" \
                         "#{OneBEX::BEX.conf[:port]}, " \
                         "threads=#{min_threads}:#{max_threads}"

        Thread.new do
            loop do
                sleep 10

                idle_for = OneBEX::BEX.idle_for

                next if idle_for < OneBEX::BEX.idle_timeout

                OneBEX::BEX.info "No requests received for #{idle_for.round}s, " \
                                 'stopping OneBEX server'

                finalize_pending_transfers(
                    "OneBEX server idle timeout after #{idle_for.round}s"
                )

                $onebex_puma&.stop
                break
            end
        rescue StandardError => e
            OneBEX::BEX.error 'Error in OneBEX idle monitoring shutdown ' \
                              "thread: #{e.message}"

            $onebex_exit_code = 1
        end

        $onebex_puma.run
    rescue Interrupt
        OneBEX::BEX.info 'OneBEX interrupted'

        finalize_pending_transfers('OneBEX interrupted')

        $onebex_exit_code = 1
    rescue StandardError => e
        OneBEX::BEX.error "OneBEX failed: #{e.message}"
        OneBEX::BEX.error e.backtrace.join("\n") if e.backtrace

        finalize_pending_transfers("OneBEX failed: #{e.message}")

        $onebex_exit_code = 1
    end

    OneBEX::BEX.info "OneBEX exiting with code #{$onebex_exit_code}"

    exit($onebex_exit_code)
end
# rubocop:enable Style/GlobalVars
