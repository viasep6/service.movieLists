const { admin } = require('../service.shared/Repository/Firebase/admin');
const { DeleteAllLists, DeleteMovieList } = require('../Services/MovieListService')

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

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
        typeof req.query.list === 'undefined' 
        ? DeleteAllLists(verified.user_id)
        : DeleteMovieList(verified.user_id, req.query.list)

        context.res = {
            body: 'Success'
        }
    })
    .catch ((err) => {
        console.error(err.message);
        return (err.code === 'auth/id-token-expired') 
        ? context.res = { status: 403, body: 'Error: Access token expired'}
        : context.res = { status: 500, body: 'Error: ' + err.message}
    })
}