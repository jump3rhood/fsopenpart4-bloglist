const listHelper = require('../utils/listHelper')
const testHelper = require('./testHelper')
const listWithOneBlog = [
  {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
  }
]

const listWithManyBlogs = testHelper.blogs;
test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})
describe('total likes', ()=> {
        
    test('empty list is zero', () => {
        expect(listHelper.totalLikes([])).toBe(0);
    })
    test('when list has one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog);
        expect(result).toBe(5);
    })
    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(listWithManyBlogs);
        expect(result).toBe(36);
    })
})

describe('favorite blog ', () => {
  test('of a list with one blog to equal that blog itself', () => {
      const result = listHelper.favoriteBlog(listWithOneBlog)
      expect(result).toEqual(  {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    });
  })
  test('of a list of blogs is the one with the most likes', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs);
    expect(result).toEqual({
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    });
  })
})

describe('top author ', () => {
  test('of one blog is the author of the blog itself', () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    expect(result).toEqual({author: 'Edsger W. Dijkstra', blogs: 1})
  })
  test('of many blogs is the author with the most blogs', () => {
    const result = listHelper.mostBlogs(listWithManyBlogs)
    expect(result).toEqual({author: 'Robert C. Martin' , blogs : 3})
  })
})

describe('most liked author', () => { 
  test(' of a list of one blog is the author itself', () => {
    const result = listHelper.mostLikes(listWithOneBlog);
    expect(result).toEqual(
      {
        author: 'Edsger W. Dijkstra',
        likes: 5
      }
    )
  })
  test(' of a list of many blogs is the author whose blog has most likes', () => {
    const result = listHelper.mostLikes(listWithManyBlogs);
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 12
    })
  })
 })