/*
Stateless web tier:

Now it's time to consider scalling the web tier horizontally. i.e adding more web servers to the pool

For this we need to move state(for instance user session data) out of the web tier.
A good practice is to session data in the persistent storage such as relation db or nosql.
Each web server in the cluster can access state data from the db. This is called stateless web tier.

Statefull Architecture:
A statefull server and a stateless server has some key differences. 
A statefull server remembers client data i.e state from one quest to the next. A stateless server keeps no state information



User A -----http request----> webserver1{
        sessionInfo of A
    }

User B -----http request----> webserver2{
        sessionInfo of B
    }
    
User C -----http request----> webserver3{
        sessionInfo of C
    }


Here, userA session data is stored in server1, to perfom any operation by userA it needs to be authenticated, thus request must be routed to server1.
If a request is sent to other servers, authentication would fail because server2, and server3 does not contain A'session info. Similary, all HTTP request from userB must
routed to server2, all request from userC to server server3

Here, the issue is that every request from the same client must be routed to the same server. This can be done with sticky sessions in most load balancers. 
However this adds the overhead. Adding or removing servers is much more difficult with this approach . It is also cahllenging to handle server failures.

Stateless Architecture:

UserA       UserB       UserC   
    \          |          /  
     \         |         /
      \        |        /
       \       |       / 
       ***********************
       *    Server1          *
       *    Server2          *   
       *    Server3          *
       *    Server4          *
       * *********************
                |
                |
        fetch state || session
                |
                v
            {shared storage}

In the stateless architecture, http request from users can be sent to any web servers, which fecth state data from a shared data store.
State data is stored in shared data store and kept out of servers. A stateless syste is simpler, more robust and scable.


                #################################
                # Web browser | Mobile client   # . <------->CDN
                #################################
                                |
                                |
                            {load balancer}
                            /      |        \
                     ******** Auto Scale *************
                     * Server1    Server2   Server3  *  --------------> Cache  
                     *********************************  \
                      |         ||             |         \ 
                      |         ||             |          \  
                      |         ||             |           {Share data store for sessions} 
                      V          V             V
                SlaveDb <---> MasterDB <----> SlaveDb   
                   read   ^      update   ^       read 
                          |               |  
                      replicate          replicate                

We move session data from the web tier and store them in the persistent data store. The shared data store could be a relational database or memcached/redis, nosql. 
Nosql is chosen as it is easy to scale. Autoscalling means adding or removing web servers automatiically based on the traffic load. 
After the sate data is removed our of webs servers, auto scaling of the web tier is easily achieved by adding or removing servers based on traffic load.


$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ Your website grows rapidly and attracts a significant number of users internatinally $$$$$$$$$$$$$$$$$$$$$$$$$

To improve availability and provide a better user experience across a wider geographical areas, supporting data centers is cruical.


Data centers:

                                            #################################
                                            # Web browser | Mobile client   # . <------->CDN
                                            #################################
                                                    |
                                                    |
                            {------------------load balancer-----------------------------------}
                                /                                                   |
                               /                                                    |    
                          Geo Routed                                                | 
                            /                                                       |
           _________________US West___________________________                      |
           |          ******** Auto Scale *************      |                      |
           |         * Server1    Server2   Server3  *       |                      |    
           |          *********************************---   |                      |    
           |           |         ||             |     |   |  |                      |
           |           |         ||             |     |   |  |                      |
           |           |         ||             |     |   |  |                      |
           |           V          V             V     |   |  |                      |
           |   SlaveDb <---> MasterDB <----> SlaveDb  |   |  |                      |
           |                  ________________________|   |  |                      |
           |                 |Cache1, Cache2, Cache3  |   |  |                      |
           |                 |________________________|   |  |                      |
           |______________________________________________|__|                      |
                                                          |                        Geo Routed
                                                          V                          |
                                           {Shared  data Store} _______________________US EAST_____________________
                                                     ^          |          ******** Auto Scale *************      |
                                                     |          |          * Server1    Server2   Server3  *      |    
                                                     |_____________________*********************************      |   
                                                                |           |         ||             |     |      |
                                                                |           |         ||             |     |      |
                                                                |           |         ||             |     |      |
                                                                |           V          V             V     |      |
                                                                |   SlaveDb <---> MasterDB <----> SlaveDb  |      |
                                                                |                  ________________________|      |   
                                                                |                 |Cache1, Cache2, Cache3  |      |
                                                                |                 |________________________|      | 
                                                                |_________________________________________________| 


Figure shows setup of two data centers. In normal operation, users are geoDNS-routed, also known as geo-routed to the closest data center.
With a split traffic of X% in US West and (100 - X) % in the US East

GeoDNS is a DNS service that allows domain names to be resolved to ip address based on the location of a user.




In the event of any signifian data center outage, we direct all traffic to a healthy data center,



Several Challenges while setting up multi data center:
-----------------------------------------------------
A. Traffic redirection:
    Effective tools are needed to direct traffic to the correct data center.
    GeoDNS can be used to direct traffic to the neasrest data center depending on where a user is located.

B. Data synchronization: 
    Users from different regions could use  our different datacenter. In failover cases, traffic might be routed to a new data center wehere data is unavaibale.
    A common strategy is to replicate data across multiple data centers.

C. Test and deployment:
    With multi-data center setup, it is important to test your website/ application at different locations. Automated deployment tools are vital to keep services consisten
    through all the data centers.


To further Scale our system,
we need to decouple different components of the system so they can be scaled independenlty. Messaging queue is a key strategy employed by many real-word distributed
 systems to solve the problem


















*/