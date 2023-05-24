/*
Designing a well known, product Y?
    How, could anyone design a popular product in an hour that has teken hundreds it not thousand of engineers to build?

It's all about asking good question. 

Over engineering is also a real disease of many engineers as they delight in purity and ignore tradeoffs.
Often unaware of the compounding costs of over engineered systems.
Many companies pay a high price for that ignorance.

You certainly do now want to demonstrate this tendency in a sytem  design interview. 
Other red flag included narrow mindedness, sutbborneess. 


In this capter, we will go over some userful tips and introduce a simple effetive framework to solve system desgin interview problems.


4 steps process for effective systen desgin interview.
Every system interview is different. A great system desgin interview is open=endeed and there is no one size fits all solition. However, there are steops and common ground to cover in 
every sytem desin interview.
    
Things to follow:

1. Ask about Requirements and Assumptions:
    In a system design interview, giving out an ansawer quickly without thinking gives you no bonus points.
    Answering without a thorough understanding of the requirement is a huge red flag as the interview is not trivia contest. There is no right answer

    So, do not jump right in to give a solition. SLow down. Think deeply and ask question to calrify requirements and assumptions.  This is extremly important.

Note:  As an engineer, we like to solve hard problems and jump into the final design; however this approach is likely to lead you to design the wrong system. 

One of the most important skills as an engineer is to ask the right question, and make proper decision.
Gather all the information needed to build a system. So ask questions.

  systemDesignInterview => (Interviewer, You) {
    questionYouNeedToAsk = {
        YOu need to ask about the requirement,
    }
  }

  when you ask question to interviewer => either responds your question directly 
                                       => or  asks you to make assumptions


  IF the latter happens, write down your assumptions on the board or paper. You might need them later.

 What kind of question to ask? 
 Ask question to understand the exact requirements. Here's a list of question to help you get started.
  i.   What specific features are we going to build?
  ii.  How many users does the product have?
  iii. How fast does the company anticipate to scale up? 
        a. What are the anticipated scales in 3 months , 6months and a year?
  iv.  What is the company's technology stack?
        a. What existing services you might levarage to simplify the design?


Example:
  If you are asked to design a news feed system, you want to ask quesitons that help you clarify the requirements. The converstaion between you 
  and the interviewer might look like this:

  Candidate: Is this mobile app ? or web app? or both?
  Interviewer: Both

  C: What are the most importatant features for the product?
  I: Ability to nake post and see friends' news feed

  C: Is the new's feed sorted in reverse chronological order or particaular order? Particular order means each post is given a different weight.
     For instance, post from your close friends are more important than posts from a group
  I: To keep things simple, let us assume the feed is sorted by reverse chronological order

  C: How many friends can a user have?
  I: 5000

  C: What is the traffic volume?
  I: 10 Million daily active users

  C: Can feed contain images, videos or just text?
  I: It can contain media files, including both images and videos.


  Above are some questoins that you can ask your interviewer. It is important to understand the requirements and clarify ambiguities.



2. Propose high level design and get buy-in 

In this step, we aim to develop a high-level design and reach an agreement with the interviewer on the design.
Is is a great idea to collaborate with the interviewer during the process.

  a. Come with an intial blueprint for the design. Ask for feedback. Treat your interviewer as a teammate and work together. Many good interviewers love 
     to talk and get involved.
  b. Draw box diagrams with key componenets on the whiteboard or paper. This might include clients(Mobile/ Web), apis, web servers, data stores, cache, CDN, message queue etc
  c. Do back of the envelope calculations to evaluate if your blueprint fits the scale constraints. Think out loud.
     Communicate with your interviewer if back of the envelop is neccessary before diving into it.

If possible, go through a few concrete use cases. This will help you frame the high level design. It is also likely that the use cases would help you discover edge cases you
have not yet considered.
Should we include api end points and database schema here?
For large design problems like: 'Design a google search engine', this is a bit of too low level. 
But for a problem like designing the backend for a multi-player poker game, this is a fair game. Communicate with your interviewer.

Example:
Let's use 'design a news feeed system' to demonstrate how to approach the high level design. 

At the high level, the design is divided into two flows:
feeed publisheing and news feed building

  A. Feed publishing 
     When a user publishes a post, corresponding data is written into cache/db, and the post will be populated into friends's news feed


     Feed  publishing:

                                Mobile 
                                   | post?content=hello
                                   V
                             {load balancer}
                                   |
                                   V
                             {web servers} 
                             /     |    \ 
                            /      |     \   
                           /       |      \   
                       Post      Fanout     Notification     
                    Service      Service      Service
                   /                |           
                  /                 |
                 /                  |
             {Post Cache}      {News Feed Cache} 
               |
               |
              {Post Db}






  B. News feed building.
     The news feed is build by aggregating friend's pots in a reverse chronological order

                        Mobile/ Client
                              |
                              |    me/feed
                              |
                       {load balancer}
                              |
                        {web servers}
                              |
                       {news feed service}
                              |
                       news feed cache


                             


Step 3: Design deep dive
At this step, you and your interviewer should already achieved the following objectives:

* Agreed on the overall goals and feature scope
* Sketech out a high level blue-print for the overall design
* Obtained feedback from your interviewer on the high level design
* Had some intial ideas about areas to focus on in deep dive based on the feedback

You shall work with the interviewer to identify and prioritize components in the architecture. It is worth stressting that every interview is different.
Sometimes, the interviewer may give off hints that she likes focusing on high level design. Sometimes, for a senior candidate interview, the discussion could be on the system
performance characterisitics, like focussing on the bottlenecks and resource estimations. In most cases, the interviewer may want you to dig into details of some system 
components. For URL shrtener, it is intresting to dive into the hash funchion design that converts a long url to a short one. For a chat system, how to reduce latency and
how to support online/offline status are two intresting topics.


Time management is essentila as it is easy to get carried away witht minute details that do not demonstrate your abilities, You much be armed with signals to show your 
interviewer. Try not to get into unnecessary details. For example, talking about the edgerank algorithm of facebook feed ranking in detail is not ideal during a system 
design interview as this takes much precious time and does not prove your ability in desigining a scalable system.


At this point, we have discussed the high level design for a news feed system and the interviewer is happy with your proposal. Next, we will investigate two of the most
importatnt use cases:

  * Feed publishing


                                Mobile 
                                   | post?content=hello
                                   V
                             {load balancer}
                                   |
                                   V
                             {web servers} -------- Notification Service
                             /     |    
                            /      |     
                           /       |      
                       Post      Fanout  ----------1-get-friends-id----> graphql db   
                    Service      Service ---------2-get-friends-data---->user cache---- userdb    
                   /                |           
                  /                 V
                 /            3 Message queue  
                /                   |
             {Post Cache}    4 Fannout workers
               |                    |
               |            5 {News Feed Cache} 
              {Post Db}




  * News feed retrival

                        Mobile/ Client
                              |
                              |    me/feed
                              |
                     1  {load balancer}
                              |
                     2   {web servers}         ------> 5 {user cache} -----> userdb
                              |               / 
                     3  {news feed service}---
                              |               \------> 5 {post cache} -----> post db 
                     4  news feed cache







Step 4: Wrap up

In this final step, the interviewer might ask you a few follow up question or give you the freedom to discuss other addiontal points.
Here are few directions:

a. The interviewer might want you to identify the system bottle necks and discuss potential improvements. Never say your design is perfect and nothing can be improved.
   There is always something to improve upon. This is great opprotunity to show your critcal thinking and leave a good final impression.

b. It could be useful to give the interviewer a recap of your design. This is particularly important if you suggested a few solutions. Refreshing your interviewer's memoery
   can be helpful after a long session.

c. Error cases(server failure, network loss, etc) are intresting to talk about

d. Operation issues are worth mentioning. How do you monitor metrics and error logs? How to roll out the system?

e. How to handle the next scale curve is also intresting topic. For example, if your current design supports 1 million users, what changes do you need to make to support 
    10 million users?

f. Propose other refinements you need if you had more time.



To wraps up, we summarize a list of dos and don't:

Dos:
  1. Always ask for clarificaiton. Do not assume your assumption is correct
  2. Understand the requirements of the problem
  3. There is neither the right answer nor the best answer. A solution designed to solve the probklems of a young startup is different that of an established company with millions 
     of user. Make sure you understand the requirements.

  4. Let the interviewer know what you are thinking, communicate with your interviewer.
  5. Suggest multiple approaches if possible,
  6. Once you agree with your interviewer on the blueprint, go into the details on each component. Design the most critacal components first
  7. Bounce ideas off the interviwer. A good interviewer works with you as a temmate
  8. Never give up.






Don'ts:

1. Don't be unprepared for typical interview questions
2. Don't jump into a solution without calrifying the requirement and assumptions
3. Don't go into too much detail on a single componenet in the begnining. Give the high level design frist then drill down
4. If you get stuck, don't hesitate to ask for hints.
5. Again communicate, don't think in silence.
6. Don't think your interview is done once you give the design. You are not done until yoour interviewer says you are done. Ask for feedback earyly and often.



Time allocation on each step:
System design interview question are usally very broad, and 45 mins or an hour is not enough to cover the entire design. Time managment is essential.
How much time should you spend on each step?
The following is a very rough guide on distributing your time in 45 min interview session. Please remember this is a rough estimate, and the actual time distribution
depens on the scope of the problem and the requireemnt from the interviewer.

1. Understand the problem and establish a design scope 3-10 mins
2. Propose high level desin and get buy in 10-15 mins
3. Design deep dive 10-25 mins
4. Wrap up 3-5 mins























*/