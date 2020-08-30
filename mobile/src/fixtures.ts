export interface User {
  firstName: string
  lastName: string
  email?: string | null
  mobileNumber?: string | null
  children: User[]
  parents: User[]
  locations: Location[]
  physicianName?: string | null
  physicianPhone?: string | null
  reviewedAt?: string | null
}

export interface Location {
  name: string
  email: string
  website: string
}

const users: { [k: string]: User } = {
  marge: {
    firstName: "Marge",
    lastName: "Simpson",
    email: "marge@thesimpsons.com",
    mobileNumber: "(939) 174-4432",
    children: [],
    parents: [],
    locations: [],
  },
  homer: {
    firstName: "Homer",
    lastName: "Simpson",
    email: "marge@thesimpsons.com",
    mobileNumber: "(939) 174-4432",
    children: [],
    parents: [],
    locations: [],
  },
  lisa: {
    firstName: "Lisa",
    lastName: "Simpson",
    children: [],
    parents: [],
    locations: [],
  },
  bart: {
    firstName: "Bart",
    lastName: "Simpson",
    email: "barthax@thesimpsons.com",
    mobileNumber: "(939) 666-1423",
    children: [],
    parents: [],
    locations: [],
  },
  maggie: {
    firstName: "Maggie",
    lastName: "Simpson",
    children: [],
    parents: [],
    locations: [],
  },
};

const locations: { [k: string]: Location } = {
  springfieldElementary: {
    name: "Springfield Elementary",
    email: "help@sprinfieldelementary.org",
    website: "https://springfieldelementary.org",
  },
  nuclearPlant: {
    name: "Springfield Nuclear Power Plant",
    email: "smithers@springfieldnuke.com",
    website: "https://sprinfieldnuke.com",
  },
  longestDaycare: {
    name: "Longest Daycare",
    email: "help@longestday.care",
    website: "https://longestday.care",
  },
  bandPractice: {
    name: "Springfield Marching Band",
    email: "help@springfieldband.org",
    website: "https://springfieldband.org"
  }
};


// Add bart, lisa, and maggie as children
[users.lisa, users.bart, users.maggie].forEach(child => {
  users.homer.children.push(child)
  users.marge.children.push(child)

  if (child === users.maggie) {
    child.locations.push(locations.longestDaycare)
  } else {
    child.locations.push(locations.springfieldElementary)
  }

  if (child === users.lisa) {
    child.locations.push(locations.bandPractice)
  }

});

// Add homer and marge as parents
[users.homer, users.marge].forEach(x => {
  users.bart.parents.push(x)
  users.lisa.parents.push(x)
  users.maggie.parents.push(x)
})

users.homer.locations.push(locations.nuclearPlant)

export default {
  locations,
  users
}
