 # frozen_string_literal: true


class UserFilter
  # @param [<Location>] location
  # @param [<ActiveRecord::Relation>] users
  # @param [<String>] name_query
  # @param [<Array<String>] roles
  # @param [<Array<String>>] statuses
  #
  def initialize(location, name_query, roles, statuses)
    @location = location
    @roles = roles
    @statuses = statuses
    @name_query = name_query
  end

  def users
    chain = @location.users.order_by_name

    unless @roles.empty?
      chain = chain.joins(:location_accounts).where(location_accounts: { location: @location, role: @roles })
    end

    unless @statuses.empty?
      chain = chain.joins(:greenlight_statuses).where('greenlight_statuses.expiration_date >= ?', Date.current).where(greenlight_statuses: { status: @statuses })
    end

    if @name_query.present?
      chain = chain.where('lower(concat(first_name, last_name)) LIKE :name_query', name_query: "%#{@name_query}%")
    end

    chain
  end
end
