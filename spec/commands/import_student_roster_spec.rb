require 'rails_helper'

RSpec.describe ImportStudentRoster, type: :model do
  let(:greenlight) { Fabricate(:greenlight_academy) }

  it 'imports a valid student roster' do
    expect(RosterImport.count).to eq(0)
    import = ImportStudentRoster.new(
      location: greenlight,
      spreadsheet_path: fixture_file_path('rosters/greenlight-academy-students.xlsx')
    )
    import.run
    expect(RosterImport.count).to eq(1)
    last_import = RosterImport.last
    expect(last_import.category).to eq('student')
    expect(last_import.status).to eq('succeeded')

    faraz = User.find_by(email: 'faraz@greenlightready.com')
    expect(faraz.first_name).to eq('Greenlight User')
    expect(faraz.last_name).to eq('Unknown')
    expect(faraz.children.first.first_name).to eq('Faraz Jr')

    expect(faraz.children.first.parents.map(&:email)).to contain_exactly('faraz@greenlightready.com', 'lucy@greenlightready.com')
  end

  it 'does not import during a dry run' do
    expect(RosterImport.count).to eq(0)
    expect(RosterImport.count).to eq(0)
    import = ImportStudentRoster.new(
      location: greenlight,
      spreadsheet_path: fixture_file_path('rosters/greenlight-academy-students.xlsx'),
      dry_run: true
    )
    import.run
    expect(RosterImport.count).to eq(1)
    expect(greenlight.users.count).to eq(0)
  end

  it 'imports a student roster after a staff roster' do
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
    import = ImportStudentRoster.new(
      location: greenlight,
      spreadsheet_path: fixture_file_path('rosters/greenlight-academy-students.xlsx')
    )
    import.run
    expect(RosterImport.count).to eq(2)
    last_import = RosterImport.last
    expect(last_import.category).to eq('student')
    expect(last_import.status).to eq('succeeded')

    faraz = User.find_by(email: 'faraz@greenlightready.com')
    expect(faraz.first_name).to eq('Faraz')
    expect(faraz.last_name).to eq('Yashar')
    expect(faraz.children.first.first_name).to eq('Faraz Jr')

    expect(faraz.children.first.parents.map(&:email)).to contain_exactly('faraz@greenlightready.com', 'lucy@greenlightready.com')
  end
end
