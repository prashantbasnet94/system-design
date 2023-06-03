/*

Access Patterns:
 Understand the types of operations you need to perform on the user posts. Determine if you require efficient random access, search, insertion, deletion, or traversal of posts. This will help you evaluate which data structures can provide the desired performance characteristics for your specific access patterns.
 1.  Random access: In Categories section, depending on post category, the posts should be displayed
 2.  Search: When a keyword is matched with the post content, the post should be displayed
 3.  Search: When a keyword is matched with the post title, the post should be displayed
 4.  Search: When a keyword is matched with the post tags, the post should be displayed
 5.  Search: When a keyword is matched with the post category, the post should be displayed


Scalability:
 Consider the expected scale of your application in terms of the number of posts and the potential growth rate.
 Some data structures may handle large datasets more efficiently than others.
 Evaluate how well a data structure can scale and handle increasing amounts of data without significant degradation in performance.
    1.  The number of posts can be in millions
    2.  The number of users can be in millions
    3.  The number of categories can be in thousands
    4.  The number of tags can be in thousands


Sorting and Ordering:
Determine if you need to maintain a specific order or sort the posts based on attributes such as timestamps, popularity, or relevance.
 Certain data structures, like trees or priority queues, are well-suited for maintaining sorted orders or enabling efficient sorting operations.

 1.  Reverse chronological order i.e. most recent first and so on
 2.  most oftenly accessed by userId or postId
 3.  most oftenly accessed by category
 4.  most oftenly accessed by tags


Memory Efficiency:
 Evaluate the memory requirements of different data structures.
 Consider the space overhead imposed by the data structure itself (e.g., pointers, tree structures) and
  whether it aligns with the available memory resources and constraints of your application.

    1.  The number of posts can be in millions
    2.  The number of users can be in millions
    3.  The number of categories can be in thousands
    4.  The number of tags can be in thousands

Real-time Updates:
 Assess if your application requires real-time updates to posts, such as live feeds or notifications.
 Consider the data structure's ability to handle frequent and concurrent updates efficiently.
 Some data structures may be better suited for real-time updates, while others may require additional synchronization or indexing mechanisms.


Complex Queries and Analytics:
If your application involves complex querying or analytics tasks, such as searching posts based on multiple attributes or performing advanced analytics,
evaluate the data structures' capabilities to support such operations efficiently.
 Some data structures may require additional indexing or integration with a dedicated search engine or analytics platform.


Integration with Database Systems:
Consider the compatibility and integration capabilities of different data structures with your chosen database system or persistence layer.
 Ensure that the data structure aligns with the database system's features and query capabilities to optimize performance and data consistency.

Trade-offs:
Understand the trade-offs associated with each data structure.
Evaluate factors such as time complexity, space complexity, ease of implementation, maintainability, and
 the learning curve for utilizing and managing the chosen data structure.
*/


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
