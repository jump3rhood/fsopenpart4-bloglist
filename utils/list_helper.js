
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
module.exports = { dummy, totalLikes, favoriteBlog }