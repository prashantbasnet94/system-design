/*
In a network system, a rate limiter is used to control the rate of traffic sent by client or service.
In the http world, a rate limiter limits the number of client request allowed to be sent over a specified period.
If the API request count exceeds the threshold defined by the rate limiter, all the excess callls are blocked. 

Here are a few examples:
* A user can write no more than 2 post per second
* You can create a maximum of 10 accounts per day from the same ip address
* You can claim remards no more than 5 times per weeek from the same device.


In this chapter, you are asked to design a rate limiter. Before starting the design, we first look at the benefits of using an API rate limiter:

    A. Prevent resource starvation caused Denial of service (DOS) attack. Almost all apis published by large tech companies enforce some form of rate limiting. 
       For example, Twitter limits the number of tweets to 300 per hour, Google docs apis have the following default limit: 300 per user per 60 seconds. for read request. 
       A rate limiter prevents DOS attack, either intentional or unintentional, by blocking the excess calls.

    B. Reduce cost, limiting excess request means fewer servers and allocating more resourcves to high priority APIS. Rate limiting  is extremly important for companies that use paid 3rd party APIS.
       For example, you are charged on per call basis for the following external apis: check credit, make a payment, retrieve health records etc. Limiting number of calls is essential
       to reduce costs.

    C. Prevent server from being overloaded. To reduce server load, a rate limiter is used to filter out excess requests caused by bots or user's misbehaviour.





Step 1: Understand the problem and establish design scope.
Rate limiting can be implememnted using different algorithms, each with it's pros and cons. The interactions between an interviewer and a candidate help to clarify the type of
rate limiter we are tyring to build.

C: What kind of rate limiter aer we going to design? Is it a client side rate limiter or server side rate limiter?
I: Great question, we will focus on server side rate limiter

C: Does the rate limitter throttle API request based on IP, the userID or other properties?
I: The rate limiter should be flexible enough to support different sets of throttle rules

C: What is the scale of the system? Is it built for a startup or a big company with a large user base?
I: System must be able to handle large number of request

C: Will the system work in a distributed environment?
I: Yes

C: Is the rate limiter a separate service or should be implemented in application code?
I: It's design decision up to you.

C: Do we need to inform user who are throttled?
I: Yes


Requirements:
Summary of the requirements for the system:

i.   Accurately limit exceesive request
ii.  Low latency. The rate limiter should not slow down http response time  
iii. Use as little memory as possible
iv.  Distributed rate limiting. The rate limiter can be shared across multiple servers or processes.
v.   Exception handling. Show clear exceptions to user when their request are throttled
vi.  High flault tolerance. If there are any problems with the rate limiter(for eg, if a cache server goes offline) it doesnot affect the entire system.


Propose a high level design and get buy in

Where to put the rate limiter?
Intuitively, you can implement a rate limiter at either the client or server side
 
    * Client-side implementation. Generally client is an unreliable place to enforce rate limiting because client requests can easily be forged by malicious actors. 
      Moreover, we might not have control over the client implmentation.

    * Server side implementation. 

                         Client 
                            |
                            |
                      Http request    
                            |
                            |
                            V
                     {Api servers with rate limiter}



    * Besides client and server side implementation, there is an alternative way. Instead of putting a rate limiter at the API servers, we create a rate limiter middleware
      which throttles request to your APIS as shown below

      Client -------------> Rate Limiter ----------> {Api Server}


      Assume our API allows 2 request per second, and a client sends 3 request to the server withing a second. The first two request are routed to API servers. However,
      the rate limiter middleware throttles the 3rd request and returns a HTTP status code 429. 
      HTTP code 429 indicates a user has sent too many requests

                        |          *     
             |--------->|--------> * Api 
      Client |--------->|--------> * Server
             |-----x--->|          * 
             |<--429----|          * 
                        |
                    Rate Limiter


    Cloud microservices have become widely popular and rate limiting is usally implemented within a component called API gateway. Api gateway is a fully managed service
    that supports rate limiting, SSL termination, authentication, ip whitelisting, serving static content etc. For now we only need to know API gateway is a middleware 
    that supports rate limiting.


While designing a rate limiter, an important question to ask ourselves is, where should the rate limiter be implmeneted?
On the server side or in a gateway?

There is no absolute answer. It depends on your company's current technology stack, engineering resources, priorites, goals etc.
Here are few general guidelines:
    1. Evaluate your tech stack such a programming language, cache service etc. Make sure your current programming langugae is efficient to implmemnt rate limiting
        on the server side.
    
    2. Identify the rate limiting algorithm that fits your business needs. When you implement everyting on the server side, you have full control of the algorithm. 
        However, your choice might be limited if you use a third party gateway.

    3. If you already used microservice architecture and included an API gateway in the design to perfom authentication, IP whitelisiting etc 
        you may add a rate limiter to the API gateway.
    
    4. Building your own rate limiting services takes time. If you do not have enough engineering resources to implement a rate limiter, a commerical API gateway
        is a better option.


Algorithms for rate limiting:

Rate limiting can be implemented using different algorithms, and each of them has distinct pros and cons. Even though this chapter does not
focus on algorithms, understanding them at high level helps to choose the right algorithm or combination of algorithms to fit our use cases.
Here's the list of popular algorithms

A. Token Bucket
B. Leaking Bucket
C. Fixed window counter
D. Sliding window log
E. Sliding window counter

A. Token Bucket Algo:
    The token bucket algorithm is widely used for rate limiting,. It is simple and commonly used by internet companies. 
    Amazon, stripe use this algorthim to throttle api request

    Token bucket algo works as follows:

    A token bucket is a container that has pre-defined capacity. Tokens are put in the bucket at preset rates periodically. Once the bucket is full, no more tokens
    are added. 












































*/