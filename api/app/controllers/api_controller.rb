require 'sidekiq/web'

class APIController < Roda
  plugin :all_verbs
  plugin :error_handler
  plugin :status_handler
  plugin :optimized_string_matchers
  # TODO: Drop dependency for pure rack
  plugin :http_auth

  UnauthorizedError = Class.new(StandardError)
  NotFoundError = Class.new(StandardError)
  ForbiddenErrorError = Class.new(StandardError)

  error do |e|
    Rails.logger.error(e.message)
    Rails.logger.error(e.backtrace.join("\n"))
    response['Content-Type'] = 'application/json'
    if e.is_a?(NotFoundError)
      JSONAPI::Errors.serialize(JSONAPI::Errors::NotFound.new).to_json
    elsif e.is_a?(UnauthorizedError)
      JSONAPI::Errors.serialize(JSONAPI::Errors::Unauthorized.new).to_json
    elsif e.is_a?(ForbiddenErrorError)
      JSONAPI::Errors.serialize(JSONAPI::Errors::Forbidden.new).to_json
    else
      if Rails.env.production?
        JSONAPI::Errors.serialize(
          JSONAPI::Errors::JSONAPIError.new(title: "#{e.class}", detail: e.message, backtrace: e.backtrace.join("\n"))
        ).to_json
      else
        raise e
      end
    end
  end

  status_handler(404) do
    response['Content-Type'] = 'application/json'
    JSONAPI::Errors.serialize(JSONAPI::Errors::NotFound.new).to_json
  end
  
  @session = Session.new
  

  route do |r|
    @session = Session.new(token: r.env['HTTP_AUTHORIZATION'])

    r.is_exactly '' do
      r.get do
        developer_message
      end
    end
    
    r.on_branch 'sidekiq' do
      http_auth { |user, pass| [user, pass] == %w[foo bar] }
      r.run Sidekiq::Web
    end

    response['Content-Type'] = 'application/json'

    r.on_branch 'v1' do
      r.is_exactly('ping') { r.get { 'pong'} }    
      r.is_exactly('error') { r.get { raise "Error" } }

      session_routes(r)
      magic_sign_in_routes(r)
      users_routes(r)
      location_routes(r)
    end
  end

  def require_auth!
    return if current_user
    raise UnauthorizedError
  end

  def require_admin!
    return if current_user.admin?
    # Users shouldn't know this exists
    raise NotFoundError
  end

  def current_user
    return @current_user if defined?(@current_user)
    @current_user = @session.user
    @current_user
  end

  def parse_request(request)
    JSON.parse(request.body.read).transform_keys { |key| key.to_s.underscore }
  end
  
  def error_response(command)
    response.status = '422'
    JSONAPI::Errors.serialize(JSONAPI::Errors::ActiveModelInvalid.new(errors: command.errors)).to_json
  end


  def magic_sign_in_routes(r)
    r.on_branch 'magic-sign-in' do
      r.is String do |token|
        data = parse_request(r)
        user = User.find_by!(magic_sign_in_token: token)
        @session = Session.from_sign_in(user, remember_me: data[:remember_me])
        @session.to_json
      end
    end
    
    r.is_exactly 'magic-sign-in' do
      r.post do
        data = parse_request(r)
        sign_in = MagicSignInRequest.new(data)
        sign_in.run
        if sign_in.succeeded?
          # TODO: What should the response code be here?
          'succes'
        else
          error_response(sign_in)
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
          error_response(authentication)
        end
      end

      r.delete do
        if current_user
          current_user.reset_auth_token!
        end
      end
    end
  end

  def users_routes(r)
    require_auth!
    r.on_branch 'users' do
      # /users/:id
      r.is String do |id|
        # GET /users/:id
        r.get do
          
          if id == 'me'
            raise NotFoundError if current_user.nil?
            user = current_user
          else
            user = User.find_by!(id: id)
          end

          raise ForbiddenError unless current_user.authorized_to_view?(user)
          includes = [
            :locations, :location_accounts, :recent_medical_events, :recent_greenlight_statuses,
            :'location_accounts.location',
            :children,
            :'children.locations', :'children.location_accounts', :'children.recent_medical_events', :'children.recent_greenlight_statuses',
            :'children.location_accounts.location'
          ]
          UserMobileSerializer.new(
            user, include: includes
          ).serialized_json
        end
        
        # PATCH /users/:id
        r.patch do
          if id == 'me'
            raise NotFoundError if current_user.nil?
            user = current_user
          else
            user = User.find_by!(id: id)
          end

          raise ForbiddenError unless current_user.authorized_to_view?(user)

          data = parse_request(r)
          user.update_attributes(data)
          
          if user.save
            response.status = '201'
            UserSerializer.new(user).serialized_json
          else
            error_response(user)
          end
        end
      end

    end
  end

  def location_routes(r)
    require_auth!
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
          require_admin!
          r.is do
            r.get do
              location = Location.find_by_id_or_permalink(location_id)

              UserSerializer.new(location.users.includes(:location_accounts, :last_greenlight_status).limit(20), { 
                include: [:location_accounts, :last_greenlight_status]
              }).serialized_json
            end
          end
        end
      end

    end
  end

  def developer_message
    "Coder, eh? Email us: hello [at] greenlightready"
  end
end
