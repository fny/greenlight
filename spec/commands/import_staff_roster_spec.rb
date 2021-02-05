require 'rails_helper'

RSpec.describe ImportStaffRoster, type: :model do
  let(:greenlight) { Fabricate(:greenlight_academy) }

  it 'imports a valid staff roster' do
    expect(RosterImport.count).to eq(0)
    import = ImportStaffRoster.new(
      location: greenlight,
      spreadsheet_path: fixture_file_path('rosters/greenlight-academy-staff.xlsx')
    )
    import.run
    expect(RosterImport.count).to eq(1)
    last_import = RosterImport.last
    expect(last_import.category).to eq('staff')
    expect(last_import.status).to eq('succeeded')

    faraz = User.find_by(email: 'faraz@greenlightready.com')
    expect(faraz.first_name).to eq('Faraz')
    expect(faraz.last_name).to eq('Yashar')
    expect(faraz.cohorts.where(location: greenlight).map(&:code)).to contain_exactly('team:ed', 'team:business', 'timezone:mst')
  end

  it 'does not import during a dry run' do
    expect(RosterImport.count).to eq(0)
    expect(RosterImport.count).to eq(0)
    import = ImportStaffRoster.new(
      location: greenlight,
      spreadsheet_path: fixture_file_path('rosters/greenlight-academy-staff.xlsx'),
      dry_run: true
    )
    import.run
    expect(RosterImport.count).to eq(1)
    expect(greenlight.users.count).to eq(0)
  end
end
