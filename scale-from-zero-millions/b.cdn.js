/*

Content delivery network (CDN):

A CDN is a network of geographically dispersed servers used to deliver static content. CDN servers cache static content like images, videos, CSS, js files and more

Dynamic content caching is a realtively new concept. Here we will discuss about CDN to cache static content.

Here's how CDN works at high level.

User ----> Website

Cdn server closest to the user will deliver static content. Intuitively, the further users are from CDN servers, the slower the website loads.
For example;
A CDN is @ san fransico, a user @ los angeles gets content faster than users @ europe.



Demonstrating CDN workflow:

         ------------ get  image.png ---------> |CDN|
User A   <----return image.png----------------- |CDN|
                                                |CDN|----------if image.png not in CDN fetch from server -------> Server
                                                |CDN|<----------store image.png  in CDN ------------------------- Server
User   ---------get image.pbg------------------>|CDN|
  B    <------return image.pbg------------------|CDN|


CDN url provided by CDN provider might look like:
https://mysite.cloudfront.net/logo.jpg
https://mysite.akamai.com/image-manager/img/logo.jpg


1. If CDN server does not have image.png in the cache, CDN server requests the file from the origin, which can be a web server or online storage like Amazon S3.
2. The origin returns image.png to the CDN server, which includes optional HTTP header, TTL : time to live which describle how long the image is cached.
3. CDN caches the image and returns it to user A. The image remoains cached in the CDN until TTL expires.
4. User B sends a request to get the same image, image is returned from the cache as long as the TTL has not expired.


Consideration of using CDN:
1. Cost:
    CDNS are run by third party providers, and you  are charged for data transfers in and out of the CDN. Caching ingrequently used assets provides no significant benefits so
    you should consider moving them out of CDN.

2. Setting an appropriate cache expiry: setting up cache expiry time is important. Cache expiry time should neither be too long nor too short.

3. CDN fall back:
    You should consider how your website/ application copes with CDN failure. If there is a temporary CDN outage, clients should be able to detect the probelm and request resources 
    from the origin.

4. Invalidating files: you can remove a file from CDN before it expires by perfoming one fo the operations:
    i. Invalidate a CDN object by using APIS provided by CDN vendors
    ii. Use object versioning to serve a different version of the object. To version an object, you can add a paramter to the url, such as a version number. For ex, 
    a version number is added tot he query strign i.e image.png?v=2


            Web Client / Mobile App  < ----------- >  CDN
                        ^    
                        |
                        |
                        v
                   Load Balancer
                   /            \
                Server1         Server2
                  | |  \        /    ||
                  | |   \      /     ||
                  | -----\----/-------|---------> Cache
                  |       \ /         |  
                  v       /\          v  
                  MasterDb  <-----> Slave Db  



Here:
1. Static assests are no longer server by webservers. They are now fectched from CDN for better perfomance.
2. Database load are lightened by cahching data


























*/