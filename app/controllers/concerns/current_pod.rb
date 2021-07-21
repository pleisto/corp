# frozen_string_literal: true

module CurrentPod
  extend ActiveSupport::Concern

  def current_pod
    return nil if current_user.nil?
    pod = warden.session['current_pod']
    return pod if pod

    pod = current_user.personal_pod.as_session_context
    warden.session['current_pod'] = pod
    pod
  end
end
