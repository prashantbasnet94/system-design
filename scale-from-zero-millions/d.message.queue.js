/*

Messaging Queue:
A message queue is a durable component, stored in memory, that supports asynchronous communication. 
It servers as a buffer and distributes aynchronous request. The basic architecture of a message queue is simple.

Input servcies, called producer/publishers, create messages and publish then to a message queue.
Other services or servers called consumers/subsriber, connect to the queue and perform actions defined by the messages. 

                         _________ Message Queue____________
Producer ----Publish---> |   Message1, Message2, Message3  |  -------- consume -----> Consumer
                         |_________________________________|


Decoupling makes the message queue a prefered architecture for building a scable and reliable application.
With message queue, the producer can post a message to the queue when the consumer is unavailable to process it. 
The consumer can read message from the queue even when the producer is unavailable.

Consider the following case:
Application supports photo customization, including cropping, sharpening, bluring etc. Those customizatin tasks take time to complete. 
We can implement messaging queeue here:

                                    ______________queue_______________                              _______consumer____
Webservers ------ publish ----->   |   message1, message2, message3  | ------------ consume  -----> | 0 0   0   0   0  | 
                                   |_________________________________|                              |__________________

Here, a web server publish photo processing jobs to the message queue. Photo processing workers pick up jobs from the message queue 
and asynchronously perfom photo customization taks. 

The producer i.e server and the consumer i.e workers can be scalled independently. 
When the size of the queue becomes larger, more workers can be added to reduce the processing time. However, if the queue is empty most of the time, the
number of workers can be reduced.

When working with a small website that runs on a few servers, logggin, metrics and automation support are good practices but not a necessity.
However, now that your site has grown to serve a large business, investing in those tools are essential.


*/