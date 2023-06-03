/*
    https://www.quora.com/Activity-Streams/What-are-the-scaling-issues-to-keep-in-mind-while-developing-a-social-network-feed

    What are the scaling issues to keep in mind while developing a social network feed?

    1. Minimize the number of disk seeks that need to happen when loading your home page



    Architture Solution:

        1. For services that uses heavy background processing, use a message queue to decouple the processing from the request/response cycle. This will allow you to scale the processing independently from the web servers.
        2. Golang is a good choice for services that need to handle a large number of concurrent requests.
        


*/