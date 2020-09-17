class APIController < Roda
  @current_user = User.first
  route do |r|
    response['Content-Type'] = 'application/json'
    r.on 'api' do
      r.on 'v1' do
        session_routes(r)
        users_routes(r)
        location_routes(r)
      end
    end
  end



  def session_routes(r)
    # session = Session.new(r.env['HTTP_AUTHORIZATION'])
    # if session.invalid?
    #   return "WHOOOPS"
    # end
    r.on 'sessions' do
      r.post do
        '{ "hello": "asdf2"}'
        # JSON.parse(r.body.read).transform_keys { |key| key.to_s.underscore }.to_s

      end
      r.delete do
        '{ "hello": "asdf"}'
      end
    end
  end


  def users_routes(r)
    r.on 'users' do

      # /users/:id
      r.on String do |id|
        r.get do
          UserSerializer.new(User.find_by(id: id)).serialized_json
        end
      end
    end
  end

  def location_routes(r)
    r.on 'locations' do
      # /locations/:id
      r.on String do |location_id|
        r.on 'users' do
          r.get do
            puts location_id
            location = Location.find_bv_id_or_permalink(location_id)

            UserSerializer.new(location.users.includes(:location_accounts).limit(100), { include: [:location_accounts] }).serialized_json
          end
        end

        r.get do

          LocationSerializer.new(Location.find_bv_id_or_permalink(location_id)).serialized_json
        end


      end

    end
  end
end
