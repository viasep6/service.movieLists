const { GetUserMovieLists } = require('../Services/MovieListService')
const { admin } = require('../service.shared/Repository/Firebase/admin');

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
            const userHasLists = typeof lists === 'undefined' ? false : true
            let listFound = false
            if (userHasLists) {
                if (typeof lists[req.query.list] !== 'undefined') {
                    return context.res = { body: lists[req.query.list] }
                }
                return context.res = { 
                    status: 200,
                    body: lists 
                }
            }
            else {
                return context.res = {
                    status: 404, 
                    body: 'User does no have any lists.' 
                }
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