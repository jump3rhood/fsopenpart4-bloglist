const _ = require('lodash')
const dummy = ( blogs ) => {
    if(blogs.length === 0)
        return 1
}

// Takes a list of blogs
// returns the sum of all the likes in all the blogs
const totalLikes = (blogs) => {
    return blogs.reduce( (a,b) => a + b.likes , 0)
}
// takes a list of blogs and returns the one with most likes
const favoriteBlog = (blogs) => {
    let maxLikes = blogs[0].likes
    for(let blog of blogs){
        if( blog.likes > maxLikes )
            maxLikes = blog.likes
    }
    return blogs.find( blog => blog.likes === maxLikes )
}
// takes list of blogs
// returns the author with the most blogs and the no of blogs
const mostBlogs = (blogs) => {
    const authors = _.countBy(blogs, 'author')
    let numBlogs = 0
    let maxAuthor = ''
    _.forEach(authors, function(value, key){
        if(value > numBlogs) {
            numBlogs = value
            maxAuthor = key
        }
    })
    return {author: maxAuthor,
        blogs: numBlogs}
}
module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs }