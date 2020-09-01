import { Model, attribute } from './base'

@Model({ singular: 'book', plural: 'books' })
class Book {
  @attribute({ type: String })
  title: string = ''
  @attribute({ type: Number })
  pages: number | null = null
}

@Model({ singular: 'libary', plural: 'libraries' })
class Library {
  @attribute({ type: String })
  name: string | null = null

  @attribute({ source: 'date', transform: v => new Date(v), type: Date })
  dateFounded: Date | null = null

  @attribute({ type: [Book] })
  books: Book[] = []
}

const data = {
  name: "Greenlight Library",
  date: "2020-01-01",
  books: [{
    title: "Green Eggs and Ham",
    pages: "10"
  }, {
    title: "The Green Mile",
    pages: 100
  }]
}

it('properly deserializes data', () => {
  const library = new Library(data)
  expect(library.name).toEqual(data.name)
  expect(library.dateFounded).toEqual(new Date(data.date))
  expect(library.books[0].title).toEqual(data.books[0].title)
  expect(library.books[0].pages).toEqual(Number(data.books[0].pages))
})
