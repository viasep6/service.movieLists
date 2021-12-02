const { GetUserMovieLists } = require('../Services/MovieListService')

module.exports = async function (context, req) {
    context.log('Request id:', context.executionContext.invocationId);
    return GetUserMovieLists(req.query.userId)
    .then(lists => {

        const userHasLists = typeof lists === 'undefined' ? false : true
        let listFound = false
        if (userHasLists) {
            listFound = typeof lists[req.query.list] === 'undefined' ? false : true
        }

        context.res = listFound ? { body: lists[req.query.list] } : { status: 404, body: 'No such list' }
    })
    .catch ((err) => {
        console.error(err);
        return context.res = {
            status: 500,
            body: 'Error: ' + err.message
        }
    })
}