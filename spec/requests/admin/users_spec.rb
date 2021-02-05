RSpec.describe "User superuser endpoints", type: :request do
  describe '#DELETE' do
    let(:parent) { p = Fabricate(:user); p.children << Fabricate(:user); p }

    before do
      allow_any_instance_of(Admin::ApplicationController).to receive(:ensure_admin!).and_return(true)
    end

    it 'deletes users' do
      expect(parent.children.count).to eq(1)
      child = parent.children.first
      delete "/admin/users/#{parent.id}?confirmation=DELETE%20#{parent.first_name}"
      expect(User.find_by(id: parent.id)).to eq(nil)
      expect(User.find(child.id)).to eq(child)
    end

    it 'nukes users' do
      expect(parent.children.count).to eq(1)
      child = parent.children.first
      delete "/admin/users/#{parent.id}?confirmation=NUKE%20#{parent.first_name}"
      expect(User.find_by(id: parent.id)).to eq(nil)
      expect(User.find_by(id: child.id)).to eq(nil)
    end
  end
end
