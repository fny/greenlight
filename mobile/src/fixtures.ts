import { User } from './models/user'

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

const simpsons: { [k: string]: User } = {
  marge: new User({
    id: 1,
    firstName: 'Marge',
    lastName: 'Simpson',
    email: 'marge@thesimpsons.com',
    mobileNumber: '(939) 174-4432',
    children: [] as any[],
    parents: [] as any[],
    locations: [] as any[],
  }),
  homer: new User({
    id: 2,
    firstName: 'Homer',
    lastName: 'Simpson',
    email: 'marge@thesimpsons.com',
    mobileNumber: '(939) 174-4432',
    children: [] as any[],
    parents: [] as any[],
    locations: [] as any[],
  }),
  lisa: new User({
    id: 3,
    firstName: 'Lisa',
    lastName: 'Simpson',
    children: [] as any[],
    parents: [] as any[],
    locations: [locations.springfieldElementary, locations.bandPractice] as any[],
  }),
  bart: new User({
    id: 4,
    firstName: 'Bart',
    lastName: 'Simpson',
    email: 'barthax@thesimpsons.com',
    mobileNumber: '(939) 666-1423',
    children: [] as any[],
    parents: [] as any[],
    locations: [locations.springfieldElementary] as any[],
  }),
  maggie: new User({
    id: 5,
    firstName: 'Maggie',
    lastName: 'Simpson',
    children: [] as any[],
    parents: [] as any[],
    locations: [locations.longestDaycare] as any[],
  }),
}

const thegreenes: { [k: string]: User } = {
  mother: new User({
    id: 6,
    firstName: 'Chloe',
    lastName: 'Greene',
    email: 'chloe@gogreene.com',
    mobileNumber: '(919) 174-4432',
    children: [] as any[],
    parents: [] as any[],
    locations: [] as any[],
  }),
  father: new User({
    id: 7,
    firstName: 'Meyer',
    lastName: 'Greene',
    email: 'hunter@gogreene.com',
    mobileNumber: '(919) 174-4432',
    children: [] as any[],
    parents: [] as any[],
    locations: [locations.forestHillsElementary] as any[],
  }),
  daughter: new User({
    id: 8,
    firstName: 'Lucy',
    lastName: 'Greene',
    children: [] as any[],
    parents: [] as any[],
    locations: [locations.greenwoodMiddle, locations.soccerLeague] as any[],
  }),
  son: new User({
    id: 9,
    firstName: 'Beacon',
    lastName: 'Greene',
    mobileNumber: '(919) 666-1423',
    children: [] as any[],
    parents: [] as any[],
    locations: [locations.forestHillsElementary] as any[],
  }),
  baby: new User({
    id: 10,
    firstName: 'Dawn',
    lastName: 'Greene',
    children: [] as any[],
    parents: [] as any[],
    locations: [locations.longestDaycare] as any[],
  }),
}

  //
  // Simpsons Relationships
  //

  // Add bart, lisa, and maggie as children
  ;[simpsons.bart, simpsons.lisa, simpsons.maggie].forEach((child: User) => {
    simpsons.homer.children.push(child)
    simpsons.marge.children.push(child)
  })

  //
  // The Greenes
  //

  ;[thegreenes.daughter, thegreenes.son, thegreenes.baby].forEach((child: any) => {
    thegreenes.father.children.push(child)
    thegreenes.mother.children.push(child)
  })

const users = {
  ...simpsons,
  ...thegreenes
}

export default {
  users
}
