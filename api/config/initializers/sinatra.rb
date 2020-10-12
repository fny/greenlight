module Sinatra
  class Request

    def secret_key_base
      Rails.application.config.secret_key_base
    end

    def use_cookies_with_metadata
      Rails.application.config.action_dispatch.use_cookies_with_metadata
    end
    def cookies_serializer
      Rails.application.config.action_dispatch.cookies_serializer
    end
    def use_authenticated_cookie_encryption
      Rails.application.config.action_dispatch.use_authenticated_cookie_encryption
    end
    def encrypted_cookie_cipher
      Rails.application.config.action_dispatch.encrypted_cookie_cipher
    end

    def signed_cookie_digest
      Rails.application.config.action_dispatch.signed_cookie_digest
    end

    def cookies_rotations
      Rails.application.config.action_dispatch.cookies_rotations
    end

    def authenticated_encrypted_cookie_salt
      Rails.application.config.action_dispatch.authenticated_encrypted_cookie_salt
    end

    def key_generator
      Rails.application.key_generator
    end
  end
end
