
const dummy = ( blogs ) => {
    if(blogs.length === 0)
        return 1
}

// Takes a list of blogs
// returns the sum of all the likes in all the blogs
const totalLikes = (blogs) => {
    return blogs.reduce( (a,b) => a + b.likes , 0)
}

module.exports = { dummy, totalLikes }