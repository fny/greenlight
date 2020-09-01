import { User } from './models/user'

const simpsons = {
  marge: {
    id: 1,
    firstName: 'Marge',
    lastName: 'Simpson',
    email: 'marge@thesimpsons.com',
    mobileNumber: '(939) 174-4432',
    children: [] as any[],
    parents: [] as any[],
    locations: [] as any[],
  },
  homer: {
    id: 2,
    firstName: 'Homer',
    lastName: 'Simpson',
    email: 'marge@thesimpsons.com',
    mobileNumber: '(939) 174-4432',
    children: [] as any[],
    parents: [] as any[],
    locations: [] as any[],
  },
  lisa: {
    id: 3,
    firstName: 'Lisa',
    lastName: 'Simpson',
    children: [] as any[],
    parents: [] as any[],
    locations: [] as any[],
  },
  bart: {
    id: 4,
    firstName: 'Bart',
    lastName: 'Simpson',
    email: 'barthax@thesimpsons.com',
    mobileNumber: '(939) 666-1423',
    children: [] as any[],
    parents: [] as any[],
    locations: [] as any[],
  },
  maggie: {
    id: 5,
    firstName: 'Maggie',
    lastName: 'Simpson',
    children: [] as any[],
    parents: [] as any[],
    locations: [] as any[],
  },
}

const thegreenes = {
  mother: {
    id: 6,
    firstName: 'Chloe',
    lastName: 'Greene',
    email: 'chloe@gogreene.com',
    mobileNumber: '(919) 174-4432',
    children: [] as any[],
    parents: [] as any[],
    locations: [] as any[],
  },
  father: {
    id: 7,
    firstName: 'Meyer',
    lastName: 'Greene',
    email: 'hunter@gogreene.com',
    mobileNumber: '(919) 174-4432',
    children: [] as any[],
    parents: [] as any[],
    locations: [] as any[],
  },
  daughter: {
    id: 8,
    firstName: 'Lucy',
    lastName: 'Greene',
    children: [] as any[],
    parents: [] as any[],
    locations: [] as any[],
  },
  son: {
    id: 9,
    firstName: 'Beacon',
    lastName: 'Greene',
    mobileNumber: '(919) 666-1423',
    children: [] as any[],
    parents: [] as any[],
    locations: [] as any[],
  },
  baby: {
    id: 10,
    firstName: 'Dawn',
    lastName: 'Greene',
    children: [] as any[],
    parents: [] as any[],
    locations: [] as any[],
  },
}

const locations = {
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
  },
  greenwoodMiddle: {
    name: "Greenwood Middle School",
    email: "help@greenwoodmiddle.org",
    website: "https://greenwoodmiddle.org",
  },
  forestHillsElementary: {
    name: "Forest Hills Elementary School",
    email: "help@foresthills.org",
    website: "https://foresthills.org",
  },
  shiningDaycare: {
    name: "Shining Daycare",
    email: "help@shinigday.care",
    website: "https://shiningday.care",
  },
  soccerLeague: {
    name: "Greenwood Soccer League",
    email: "help@greenwoodsoccer.org",
    website: "https://greenwoodsoccer.org"
  }
}

//
// Simpsons Relationships
//

// Add bart, lisa, and maggie as children
;[simpsons.bart, simpsons.lisa, simpsons.maggie].forEach((child: any) => {
  simpsons.homer.children.push(child)
  simpsons.marge.children.push(child)

  if (child === simpsons.maggie) {
    child.locations.push(locations.longestDaycare)
  } else {
    child.locations.push(locations.springfieldElementary)
  }

  if (child === simpsons.lisa) {
    child.locations.push(locations.bandPractice)
  }
})

// Add homer and marge as parents
;[simpsons.homer, simpsons.marge].forEach((x: any) => {
  simpsons.bart.parents.push(x)
  simpsons.lisa.parents.push(x)
  simpsons.maggie.parents.push(x)
})

// Add homer to his work
simpsons.homer.locations.push(locations.nuclearPlant)

//
// The Greenes
//

;[thegreenes.daughter, thegreenes.son, thegreenes.baby].forEach((child: any) => {
  thegreenes.father.children.push(child)
  thegreenes.mother.children.push(child)
})

thegreenes.daughter.locations.push(locations.greenwoodMiddle)
thegreenes.daughter.locations.push(locations.soccerLeague)
thegreenes.son.locations.push(locations.forestHillsElementary)
thegreenes.baby.locations.push(locations.shiningDaycare)

const users: {[k: string]: User } = {}
const usersData = {
  ...simpsons,
  ...thegreenes
}
// Object.keys(usersData).forEach((key) => {
//   users[key] = new User((usersData as any)[key])
// })

export default {
  users: usersData
}
