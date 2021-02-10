Pagy::VARS[:items] = 25

class Pagy
  # Add a specialized backend method for pagination metadata
  module Backend
    private

    include Helpers

    def pagy_links(pagy, url=false)
      scaffold_url = pagy_url_for(PAGE_PLACEHOLDER, pagy, url)
      {
        first: scaffold_url.sub(PAGE_PLACEHOLDER, 1.to_s),
        prev: scaffold_url.sub(PAGE_PLACEHOLDER, pagy.prev.to_s),
        self: scaffold_url.sub(PAGE_PLACEHOLDER, pagy.page.to_s),
        next: scaffold_url.sub(PAGE_PLACEHOLDER, pagy.next.to_s),
        last: scaffold_url.sub(PAGE_PLACEHOLDER, pagy.last.to_s)
      }
    end

    def pagy_numbers(pagy)
      {
        # self: pagy.page,
        next: pagy.next,
        last: pagy.last,
        count: pagy.count
      }
    end
  end
end
