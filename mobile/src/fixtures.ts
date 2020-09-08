import { User, Location } from './common/models'

const locations = {
  springfieldElementary: new Location({
    name: "Springfield Elementary",
    email: "help@sprinfieldelementary.org",
    website: "https://springfieldelementary.org",
  }),
  nuclearPlant: new Location({
    name: "Springfield Nuclear Power Plant",
    email: "smithers@springfieldnuke.com",
    website: "https://sprinfieldnuke.com",
  }),
  longestDaycare: new Location({
    name: "Longest Daycare",
    email: "help@longestday.care",
    website: "https://longestday.care",
  }),
  bandPractice: new Location({
    name: "Springfield Marching Band",
    email: "help@springfieldband.org",
    website: "https://springfieldband.org"
  }),
  greenwoodMiddle: new Location({
    name: "Greenwood Middle School",
    email: "help@greenwoodmiddle.org",
    website: "https://greenwoodmiddle.org",
  }),
  forestHillsElementary: new Location({
    name: "Forest Hills Elementary School",
    email: "help@foresthills.org",
    website: "https://foresthills.org",
  }),
  shiningDaycare: new Location({
    name: "Shining Daycare",
    email: "help@shinigday.care",
    website: "https://shiningday.care",
  }),
  soccerLeague: new Location({
    name: "Greenwood Soccer League",
    email: "help@greenwoodsoccer.org",
    website: "https://greenwoodsoccer.org"
  }),
  beyuCaffe: new Location({
    name: "Beyu Caffe",
    email: "info@beyucaffe.com",
    website: "https://beyucaffe.com"
  })
}

const simpsons: { [k: string]: User } = {
  marge: new User({
    id: '1',
    firstName: 'Marge',
    lastName: 'Simpson',
    email: 'marge@thesimpsons.com',
    mobileNumber: '(939) 174-4432',
    children: [] as User[],
    parents: [] as User[],
    locations: [] as User[],
  }),
  homer: new User({
    id: '2',
    firstName: 'Homer',
    lastName: 'Simpson',
    email: 'marge@thesimpsons.com',
    mobileNumber: '(939) 174-4432',
    children: [] as User[],
    parents: [] as User[],
    locations: [] as User[],
  }),
  lisa: new User({
    id: '3',
    firstName: 'Lisa',
    lastName: 'Simpson',
    children: [] as User[],
    parents: [] as User[],
    locations: [locations.springfieldElementary, locations.bandPractice] as Location[],
  }),
  bart: new User({
    id: '4',
    firstName: 'Bart',
    lastName: 'Simpson',
    email: 'barthax@thesimpsons.com',
    mobileNumber: '(939) 666-1423',
    children: [] as User[],
    parents: [] as User[],
    locations: [locations.springfieldElementary] as Location[],
  }),
  maggie: new User({
    id: '5',
    firstName: 'Maggie',
    lastName: 'Simpson',
    children: [] as User[],
    parents: [] as User[],
    locations: [locations.longestDaycare] as Location[],
  }),
}

const thegreenes: { [k: string]: User } = {
  mother: new User({
    id: '6',
    firstName: 'Chloe',
    lastName: 'Greene',
    email: 'chloe@gogreene.com',
    mobileNumber: '(919) 174-4432',
    children: [] as User[],
    parents: [] as User[],
    locations: [] as User[],
  }),
  father: new User({
    id: '7',
    firstName: 'Meyer',
    lastName: 'Greene',
    email: 'hunter@gogreene.com',
    mobileNumber: '(919) 174-4432',
    children: [] as User[],
    parents: [] as User[],
    locations: [locations.forestHillsElementary] as Location[],
  }),
  daughter: new User({
    id: '8',
    firstName: 'Lucy',
    lastName: 'Greene',
    children: [] as User[],
    parents: [] as User[],
    locations: [locations.greenwoodMiddle, locations.soccerLeague] as Location[],
  }),
  son: new User({
    id: '9',
    firstName: 'Beacon',
    lastName: 'Greene',
    mobileNumber: '(919) 666-1423',
    children: [] as User[],
    parents: [] as User[],
    locations: [locations.forestHillsElementary] as Location[],
  }),
  baby: new User({
    id: '10',
    firstName: 'Dawn',
    lastName: 'Greene',
    children: [] as User[],
    parents: [] as User[],
    locations: [locations.longestDaycare] as Location[],
  }),
}

const beyu =  new User({
  id: 'beyu',
  firstName: 'Dorian',
  lastName: 'Bolden',
  email: 'dorian@beyucaffe.com',
  mobileNumber: '(919) 683-1058',
  children: [] as User[],
  parents: [] as User[],
  locations: [locations.beyuCaffe] as Location[],
})

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

const users: { [k: string]: User } = {
  ...simpsons,
  ...thegreenes,
  beyu
}

export default {
  users
}
