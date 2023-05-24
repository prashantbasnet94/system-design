/*

    https://medium.com/@metaverseguy/design-a-news-feed-system-6bf42e9f03fb

    News feed design can be break down into 3 parts:
    1. Data model
    2. Feed generation
    3. Feed delivery

    these are recommended by github auto pilot

    However, let's just break it down into 2 parts:
    1. Feed Publishing
    2. Feed Retrieval



    Feed Publishing:
        A. Push Model / Fanout on write:
            When a user publishes a post, it is pushed to all the followers of the user. This is called fanout on write.
            This approach is simple and easy to implement. However, it is not scalable. When a user has millions of followers, the fanout operation becomes expensive.
            This approach is not recommended for large scale applications.

            In this model recipents will be subsribed to the messaging queue. Once the activity is generated, it's pushed to into the queue. and subsribers get a notification.


            Cons:
                i. Push model will start breaking if we have to push the messages to a large audience.
                    for example, if a user has 1 million followers, we have to push the message to 1 million users. This is not scalable.
                    and also if this fails, there will be a backlog of feeds.
                    An alternative strategy is using different priorites for the fan out operation. You can mark fan out to active users as high priority and fan out to inactive users as low priority.


        B. Pull Model / Fanout on read:
            In this model, when a user publishes a post, the activity is stored in the database. When a user requests for the feed, the activities are fetched from the database and sent to the user.
            In the pull model, when a user post, it is stored in the database/memory. and pulling the data at the time a user loads their home page. This is called fanout on read.



            Cons:
                i. This approach is not suitable for real time applications. For example, if a user posts a message, it will not be visible to the followers until the next time they load their home page.
                ii. Downisde of pull model is that failure scenario is more catastrophic, instead of just delaying updates, you may potentially fail to generate a user's feed.
                    One workaround is to have a fallback method i.e get updates of 10 friends only.
                iii. This approach is not suitable for real time applications. For example, if a user posts a message, it will not be visible to the followers until the next time they load their home page.


          ----------------------------------    Note ----------------------------------
            Choosing normalized or denormalized data model:
            The feed with the activities by people you follow either
                i. contains the ids of the post => Normalized
                ii. contains the entire post => Denormalized

            Normalized data model:
                In this model, the feed contains the ids of the post. When a user requests for the feed, the post ids are fetched from the database and sent to the user.
                The user then fetches the post from the database using the post ids. This is called normalized data model.

                Storing id alone will reudce memory usage but add an additional overhead of getting the post from the database based on the id.
                This approach is suitable for applications where the post is large and the feed is small. For example, twitter has a 140 character limit for tweets.

                If you are building a system in which feed will go to many users, the data will be copied many times and hence memory can be insufficient

                With Redis you need to be careful about menory usage. Redis is an in-memory data structure store, used as a database, cache and message broker.
                Cassandra on the other hand has plenty of storage sapce but is quite hard to use if you normalize your data

                Redis VS Cassandra:
                Redis is read optimized and stores all data in memory.
                Cassandra is write optimized data stores



            With Redis:
                1. Create your db post record
                2. For each friend of the user, add the post id to the friend's feed


            Denormalized data model:
                ????????


            Hybrid Approach Push and Pull:


*/