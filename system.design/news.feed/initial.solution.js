/*

    Pull Based:

        1. Post Tweet:
            1. Client ask to add a new tweet record
            2. Web servers as tweet service to add a new record
                postTweet(request, tweet){
                    DB.insert(tweet)
                    return success
                }

        Complexity:
                1. Post a tweet is 1 DB write



        2. News Feed:
                1. Client ask web server to get news feed
                2. Server ask friendship service to get all followings/friends
                3. Server ask tweetService to get all Tweets from Followings/Friends
                4. Server merges each N tweets from each followings/friends
                5  Server returns the merged tweets to client


                each following first 100 tweets
                getNewsFeed(request){
                    followings = friendshipService.getFollowings(request.userId)
                    newFeed = []
                    for follow in followings:
                        tweets = tweetService.getTweets(follow.userId, 100)
                        newsFeed.merge(tweets)
                    sort(newsFeed)
                    return newsFeed
                }

        Complexity:
                1. Algorithm level:
                  getFollowings   =>  O(1) || O(F)
                  looping Over F =>  O(F)
                  getTweets      =>  O(1) || O(T)
                  newsFeed.merge  =>  O(T), T is the number of tweets
                  sorting => O(T log T)

                 100NLogN => k is the number of followings/friends




                2. System level:
                    1. Get news Feed:
                       a.   For N number of friends/followings we need to retrieve tweets from each of them.
                            Each user profile requires a separate DB read operation to fetch their tweets.
                            If a user has 1000 friends, we need to make 1000 DB reads to fetch their tweets.

                            N DB reads

                        b.  K represents the number of sorted lists that need to be merged into a single sorted list.
                            Each sorted list represents the tweets retrieved for a particular user.
                            the term "K-way merge" here refers to merging the tweets from multiple users, where K represents the number of users (not the number of tweets).
                             Each user's tweets can be considered as a sorted list, and the K-way merge combines these sorted lists into a single sorted list, which is the newsFeed list.
                            K way merge



                Optimization:
                        a. 1000 query to 1 query
                           Instead of making N separate DB reads, you can optimize by integrating the DB queries into a single query.
                           By fetching the tweets for all the users in the followings list with a single DB query,
                           you can reduce the number of DB read operations, which can significantly improve performance.

                        b. K way merge   => Priority Queue || Heap
                            instead of merging the entire list of tweets at once, you can maintain a priority queue where each tweet is associated with it's user.
                            By comparing timestamps or other relevant crientreria, you can efficeintly retrieve the most recent tweet from the priority queue.
                            Ensuring, the newsfeed list remains sorted as new tweets are added to the priority queue.



    Push Based:

                Additional Storage:
                    This approach has a additional newsfeed table.
                    Newsfeed table contains the newsfeed for each user.
                    Newsfeed table schema is as follows:

                const tweetSchema = new mongoose.Schema({
                id: ,
                ownerId ,
                tweetId,
                createdAt
                });

            Everyone's newsfeed is stored in a single table.

            NewfeedDb.find({ownerId: userId}).sort({createdAt: -1}).limit(100)


            Post Tweet:
                1. Client ask server to post a tweet
                2. Server ask tweet service to insert a new tweet into the tweet table
                3. Server ask the tweet service to initiate an async task to update the newsfeed table
                    a. Asyncronous task gets all followers of the user
                    b. Asyncronous task fanout new tweet to followers newfeed table


                    PostTweet(request, tweet){
                        tweet = DB.insertTweet(requst.user, tweet)

                        // do not need to blocked unitl finished // RabbitMQ/Kafka
                        AsyncService.fanoutTweet(request.user, tweet)
                        return success
                    }


                    AsyncService.fanoutTweet(user, tweet){
                        followers = friendshipService.getFollowers(user)
                        for follower in followers:
                            DB.insertNewsFeed(tweet, follower)
                    }



            Complexity:
                    Post a tweet:
                        N Followers, N DB writes. Executed in Asyncronous way


























*/