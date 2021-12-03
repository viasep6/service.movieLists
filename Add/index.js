const { GetUserMovieLists, AddorUpdateMovieList, AddNewUserAndMovieList } = require('../Services/MovieListService')
const { admin } = require('../service.shared/Repository/Firebase/admin');

/**
 * Creates or updates a users movielist.
 * Completely overwrites movies if list exists.
 */
module.exports = async function (context, req) {
    context.log('Request id:', context.executionContext.invocationId);

    if (!(req.headers.authorization && req.headers.authorization.startsWith('Bearer '))) {
        return context.res = {
            status: 403,
            body: 'error: Unauthorized'
        }
	} 

    return admin
    .auth()
    .verifyIdToken(req.headers.authorization.split('Bearer ')[1])
    .then(async verified => {

        return await GetUserMovieLists(verified.user_id)
        .then(lists => {
            const userHasLists = typeof lists === 'undefined' ? false : true;
            let isExistingList = false;

            if (userHasLists) {
                isExistingList = typeof lists[req.body.name] === 'undefined' ? false : true;
            }

            item = {
                [req.body.name]: {
                    updated: new Date().toISOString(),
                    created: (userHasLists && isExistingList) ? lists[req.body.name].created : new Date().toISOString(),
                    movies: req.body.movies
                }
            };

            userHasLists ? AddorUpdateMovieList(verified.user_id, item) : AddNewUserAndMovieList(verified.user_id, item)

            context.res = {
                body: 'Success'
            }
        })
    })
    .catch ((err) => {
        console.error(err.message);
        return (err.code === 'auth/id-token-expired') 
        ? context.res = { status: 403, body: 'Error: Access token expired'}
        : context.res = { status: 500, body: 'Error: ' + err.message}
    })
}