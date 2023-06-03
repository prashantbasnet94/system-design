/*
  Just using Binary search tree, calculating news feed require whole friendBST traversal for each user

  This can be reduced by using priority queue

Maintain a Priority Queue for each user's news feed:

1. Whenever a user's friend makes a new post, add that post to the user's priority queue.
    The priority of a post can be determined based on its timestamp

2. Update friendBST schema:
    You no longer need the postBstId in the friendBST schema, because you're now storing posts in the priority queue

let frindBST = {
    userId: ObjectId
}

New process for news feed generation:
function getNewsFeed(userId) {
   // Get the user's priority queue
   let newsFeedQueue = getUserNewsFeedQueue(userId);

   // Get the top N posts from the priority queue
   let topPosts = newsFeedQueue.getTopNPosts();

   // For each post, retrieve the post details, comments, and likes
   for (let post of topPosts) {
      let postDetails = getPostDetails(post.postId);
      let comments = getComments(post.commentBstId);
      let likes = getLikes(post.likesBstId);

      // Add the details to the post
      post.details = postDetails;
      post.comments = comments;
      post.likes = likes;
   }

   return topPosts;
}

This approach significantly reduces the number of lookups when a user opens their news feed,
 because you're no longer traversing the BST for each friend.
 However, it increases the complexity when a friend makes a new post, because you have to update the priority queue for each of their friends.

This is a trade-off between read and write operations:
 you're increasing the cost of write operations (posting) to decrease the cost of read operations (viewing the news feed).


*/


/*
==================> When a User Makes a Post:: <==================

1. The user submits a new post.
2. The new post is saved in the Posts collection in the database with a unique postId.
    At this point, you may also generate corresponding commentBst and likesBst structures (probably empty at this point) and associate their IDs with the post.


        let newPost = {
        date: Date.now(),
        userId: userId, // the ID of the user who made the post
        postId: newPostId, // the ID of the new post
        commentBstId: newCommentBstId, // the ID of the comment BST for the new post
        likesBstId: newLikesBstId // the ID of the likes BST for the new post
        }

3.  Retrieve the list of the user's friends from the friendBST associated with the user's ID.

4. For each friend, add the new post to the friend's news feed priority queue.
    The post's priority can be determined by its timestamp (and possibly other factors, such as engagement or relevance to the friend).


        for (let friendId of userFriends) {
        let friendNewsFeedQueue = getNewsFeedQueue(friendId);
        friendNewsFeedQueue.add(newPost);
        }


==================> When Retrieving the News Feed: <==================
1.The user requests to view their news feed.

2.Retrieve the user's news feed priority queue.

    let newsFeedQueue = getUserNewsFeedQueue(userId);


3. Get the top N posts from the priority queue.
    These are the posts to display on the user's news feed.

    let topPosts = newsFeedQueue.getTopNPosts();

4.For each post, retrieve the post details, comments, and likes from the Posts collection using the postId, commentBstId, and likesBstId associated with the post.

        for (let post of topPosts) {
        let postDetails = getPostDetails(post.postId);
        let comments = getComments(post.commentBstId);
        let likes = getLikes(post.likesBstId);

        // Add the details to the post
        post.details = postDetails;
        post.comments = comments;
        post.likes = likes;
        }

5. The retrieved top posts, along with their details, comments, and likes, are then displayed on the user's news feed.

    This design requires updating the news feed priority queue of each friend whenever a user makes a new post,
     which can be computationally expensive, especially if the user has many friends.
      However, it makes retrieving the news feed very efficient, because the posts are already sorted in the priority queue.


*/
