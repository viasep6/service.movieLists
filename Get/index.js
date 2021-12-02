const { db } = require('../service.shared/Repository/Firebase/admin')
const firebase = require("firebase-admin")

module.exports = async function (context, req) {
    context.log('Request id:', context.executionContext.invocationId);
    const movieLists = db.collection('lists')

    if (req.method === 'GET') {
        if (req.query.userId){
            userLists = movieLists.doc(req.query.userId)
            try {
                if (req.query.list) {
                    doc = await userLists.where('name', '==', req.query.list).get()
                    if (doc.exists) {
                        httpStatus = 200
                        responseMessage = doc.data()
                    }
                    else {
                        httpStatus = 400
                        responseMessage = 'No such list!'
                    }
                }
                else {
                    context.log('Movie List: All')
                    docs = await userLists.get()
                    if (docs.exists) {
                        httpStatus = 200
                        responseMessage = docs.data()
                    }
                    else {
                        httpStatus = 400
                        responseMessage = 'User does not have any lists!'
                    }
                }
            }
            catch (e) {
                httpStatus = 500
                responseMessage = 'Ooops something went wrong! ' + e.message
            } 
        }
        else {
            httpStatus = 400
            responseMessage = 'userId not found in request.'
        }
    }
    else if (req.method === 'POST'){
        if (req.body && req.query.userId) {
            const item = {
                name: req.body.name,
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
                movies: req.body.movies
            }
            res = await db.collection('lists').doc(req.query.userId).update({
                lists: firebase.firestore.FieldValue.arrayUnion(item)
            })
            httpStatus = 200
            responseMessage = 'Movie list added.'

        }
        else {
            httpStatus = 400
            responseMessage = 'User id or list not found in request!'
        }
    }

    context.res = {
        status: httpStatus,
        body: responseMessage
    };
}