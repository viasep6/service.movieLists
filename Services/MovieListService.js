const { db } = require('../service.shared/Repository/Firebase/admin')

exports.GetUserMovieLists = async (userId) => await db
.collection('movieLists')
.doc(userId)
.get()
.then(doc => doc.exists && typeof doc.data() === 'undefined' ? 'undefined' : doc.data())
.catch ((err) => {
    console.error(err);
    return err
})

exports.AddorUpdateMovieList = async (userId, item) => await db
.collection('movieLists')
.doc(userId)
.update(item)
.catch ((err) => {
    console.error(err);
    return err;
})

exports.AddNewUserAndMovieList = async (userId, item) => await db
.collection('movieLists')
.doc(userId)
.set(item)
.catch ((err) => {
    console.error(err);
    return err;
})