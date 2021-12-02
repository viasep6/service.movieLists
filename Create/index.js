const { GetUserMovieLists, AddorUpdateMovieList, AddNewUserAndMovieList } = require('../Services/MovieListService')

/**
 * Creates or updates a users movielist.
 * Completely overwrites movies if list exists.
 */
module.exports = async function (context, req) {
    context.log('Request id:', context.executionContext.invocationId);

    return GetUserMovieLists(req.query.userId)
    .then(lists => {

        const userHasLists = typeof lists === 'undefined' ? false : true
        let isExistingList = false
        if (userHasLists) {
            isExistingList = typeof lists[req.body.name] === 'undefined' ? false : true
        }
        
        item = {
            [req.body.name]: {
                updated: new Date().toISOString(),
                created: (userHasLists && isExistingList) 
                ? lists[req.body.name].created : new Date().toISOString(),
                movies: req.body.movies
            }
        }

        userHasLists ? AddorUpdateMovieList(req.query.userId, item) : AddNewUserAndMovieList(req.query.userId, item)

        context.res = {
            body: 'Success'
        }
    })
    .catch ((err) => {
        console.error(err);
        return context.res = {
            status: 500,
            body: 'Error: ' + err.message
        }
    })
}