# frozen_string_literal: true
module Admin
  class TextMessagesController < ApplicationController

    def new
      @sms = PlivoSMS.new
    end

    def create
      @sms = PlivoSMS.new(params[:plivo_sms])
      if @sms.valid?
        @sms.work
        flash[:notice] = "Text messages sent!"
        redirect_to action: :new
      else
        render :new
      end
    end
  end
end
