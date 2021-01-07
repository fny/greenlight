# frozen_string_literal: true
module Admin
  class RosterImportsController < ApplicationController
    def index
      imports = RosterImport.includes(:location).all.order('created_at DESC')
      @pagy, @imports = pagy(imports)
    end

    def show
      @import = RosterImport.find(params[:id])
    end
  end
end
