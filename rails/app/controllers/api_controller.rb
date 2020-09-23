class APIController < Roda
  plugin :error_handler
  plugin :status_handler
  plugin :optimized_string_matchers

  # error do |e|
  #   response['Content-Type'] = 'application/json'
  #   JSONAPI::Errors.serialize(
  #     JSONAPI::Errors::JSONAPIError.new(title: "#{e.class}", detail: e.message, backtrace: e.backtrace.join("\n"))
  #   ).to_json
  # end

  status_handler(404) do
    response['Content-Type'] = 'application/json'
    JSONAPI::Errors.serialize(JSONAPI::Errors::NotFound.new).to_json
  end
  

  @current_user = nil
  @session = Session.new

  route do |r|
    @session = Session.new(token: r.env['HTTP_AUTHORIZATION'])
    @current_user = @session.user

    response['Content-Type'] = 'application/json'
    r.on_branch 'api' do
      r.on_branch 'v1' do
        r.is_exactly('ping') { r.get { 'pong'} }    
        r.is_exactly('error') { r.get { raise "Error" } }

        session_routes(r)
        users_routes(r)
        location_routes(r)
      end
    end
  end

  def parse_request(request)
    JSON.parse(request.body.read).transform_keys { |key| key.to_s.underscore }
  end
  

  def magic_sign_in_routes(r)
    r.is_exactly 'magic-sign-in' do
      r.post do
        data = parse_request(r)
        sign_in = MagicSignIn.new(data)
        sign_in.ip_address = r.ip
        sign_in.run
        if sign_in.succeeded?
          # success response
        else
          # error response
        end
      end
    end
  end

  def session_routes(r)
    r.is_exactly 'sessions' do
      r.post do
        data = parse_request(r)
        authentication = Authentication.new(data)
        authentication.ip_address = r.ip
        authentication.run
        if authentication.succeeded?
          @session = Session.from_sign_in(authentication.result, remember_me: data[:remember_me])
          @session.to_json
        else
          response.status = '422'
          JSONAPI::Errors.serialize(JSONAPI::Errors::ActiveModelInvalid.new(errors: authentication.errors)).to_json
        end
      end

      r.delete do
        if @current_user
          @current_user.reset_auth_token!
        end
      end
    end
  end

  def users_routes(r)
    r.is_exactly 'users' do
      # /users/:id
      r.is String do |id|
        r.get do
          if id == 'me'
            # Do this to trigger an error
            User.find_by!(id: 'me') if @current_user.nil?
            user = @current_user
          else
            user = User.find_by!(id: id)
          end
          includes = [:children, :locations, :location_accounts, :recent_medical_events, :recent_greenlight_statuses]
          UserMobileSerializer.new(
            user, include: includes
          ).serialized_json
        end
      end
    end
  end

  def location_routes(r)
    r.is_exactly 'locations' do
      r.is do
        # /locations/:id
        r.get do
          LocationSerializer.new(Location.all).serialized_json
        end
      end
      
      r.is_exactly String do |location_id|
        r.is do
          r.get do
            LocationSerializer.new(Location.find_by_id_or_permalink(location_id)).serialized_json
          end
        end
        
        r.is_exactly 'users' do
          r.is do
            r.get do
              location = Location.find_by_id_or_permalink(location_id)

              x = UserSerializer.new(location.users.includes(:location_accounts, :last_greenlight_status).limit(20), { 
                include: [:location_accounts, :last_greenlight_status]
              }).serialized_json
            end
          end
        end
      end

    end
  end
end