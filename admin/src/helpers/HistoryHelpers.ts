import history from '../history'

export function openNewUser() {
  history.push('/users/new');
}

export function openEditUser(id: string) {
  history.push(`/users/${id}/edit`)
}

export function openDeleteUser(id: string) {
  history.push(`/users/${id}/delete`)
}

export function openDeleteUsers() {
  history.push('/users/delete')
}

export function openUpdateUsersStatus() {
  history.push('/users/update-status')
}