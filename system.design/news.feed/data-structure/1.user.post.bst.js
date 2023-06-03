const { ObjectId } = require('mongodb')


let postBST = {
    date: Date.now(),
    userId: ObjectId,
    postId: ObjectId,
    commentBstId: ObjectId,
    likesBstId: ObjectId
}


let commentBst = {
    date: Date.now(),
    commentId: ObjectId
}

let likesBst = {
    date: Date.now(),
    userId: ObjectId
}


/*
    postBST is attached with userModel

    To retrive a user post, we need to look up the postBST
    So when generating the post
    1. Look up the postBST
        a. get the postDetails from postId
        b. get the commentBst from commentBstId
        c. get the likesBst from likesBstId

    2. Look up the commentBst
        a. get all the comments with [commentId] sorted by date
        b. further looks up commnetModels sorted by commentId, and get all the comment details

    3. Look up the likesBst
        a. get all the likes  by user with [userId] sorted by date
        b. further looks up usermodel sorted by userId, and get user detail
*/

// sorted by userId in bst
let frindBST = {
    //friendid
    userId: ObjectId,
    postBstId: ObjectId
}


/*
    Genearting newsfeed of a user

    friendBst is attached with userModel

    1. Look up the friendBST
        a. get all the postBstId sorted by userId of friends i.e friendPostBstIds = [postBstId1, postBstId2, postBstId3, ...]
        b. further lookup postBst by these ids, and get all the post details
           i. so far each postBstNode has postId, commentBstId, likesBstId
           ii. further look up for postDetails from postId
           iii. further look up for commentBst from commentBstId
                . get an array of commentIds sorted by date
                . further look up for commentModels sorted by commentId, and get all the comment details
           iv. further look up for likesBst from likesBstId
                . get an array of userIds sorted by date
                . further look up for userModels sorted by userId, and get all the user details

    This is done for all the postBstIds found from friendBst,
    so this calculation is done for all the friends of a user
    which is expensive operation.
*/
