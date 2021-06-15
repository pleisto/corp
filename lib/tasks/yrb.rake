# frozen_string_literal: true
namespace :yrb do
  desc "Usage: `websocketd bundle exec rails yrb:ws_echo`"
  task "ws_echo" do
    # puts("ok")
    STDOUT.sync = true

    redis = Redis.new(url: "redis://localhost:6379")
    puts redis.ping

    # puts Brickdoc::Yrb.configuration.to_json

    names = [
      "AUTH_TYPE",
      "CONTENT_LENGTH",
      "CONTENT_TYPE",
      "GATEWAY_INTERFACE",
      "PATH_INFO",
      "PATH_TRANSLATED",
      "QUERY_STRING",
      "REMOTE_ADDR",
      "REMOTE_HOST",
      "REMOTE_IDENT",
      "REMOTE_PORT",
      "REMOTE_USER",
      "REQUEST_METHOD",
      "REQUEST_URI",
      "SCRIPT_NAME",
      "SERVER_NAME",
      "SERVER_PORT",
      "SERVER_PROTOCOL",
      "SERVER_SOFTWARE",
      "UNIQUE_ID",
      "HTTPS",
    ]

    names.each do |name|
      value = ENV[name] || "<unset>"
      puts "#{name}=#{value}"
    end

    # Additional HTTP headers
    ENV.each do |name, value|
      puts "#{name}=#{value}" if name.start_with?("HTTP_")
    end

    loop do
      readline = STDIN.readline
      File.write("tmp/yrb.txt", readline, mode: "a")
      puts readline.strip
    rescue EOFError => _e
      :ignore
    rescue => e
      File.write("tmp/yrb_error.txt", e.message, mode: "a")
    end
  end
end
