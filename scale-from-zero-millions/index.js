/*

Non-relational databases might be the right choice if:

1. Your application requires super low latency
2. You data are unstrucutred and you don;t ahve any relational data
3. You only need to serialize and deserialize data (JSON, XML, YAML)
4. You need to store massive amount of data.


Vertical Scalling vs Horizontal Scalling

Vertical Scalling:       ^   
Refered to as scale up   | . means process of adding more power Cpu, ram to your server. Basicalling Adding more addware power

Just increase the cpu and ram of current server

Horizonta Scalling:
Scale out  --->, allows you to scale by adding more servers into your pool of resources.

Add similar server to the the pool of server.

When to scale vertical vs horizontal?
When traffic is low, vertical scalling is great option, and the simplicity of vertical scalling is it's main advantage.
Unfortunately, it comes with serious limitation.
    a. Vertical scalling has a hard limit => impossible to add unlimited cpu and memroy to a single sever
    b. Vertical scaling does not have failover and redundancy. If one server goes down, the website/ app goes down with it completely.

Horizontal scalling is more desirable for large scale application due to the limiations of vertical scalling.

In one single server design, users are connected to the web server directly. Users will unable to access website if the web  server is offline. 
If many users access the web server simultaneously and it reaches the web server's load limit. user generally experince slower response or fail to connect to the server.
A load balencer is the best technique to address these problem


Before load balancer:
Web Client/ App <=> api <=> server  <=> Database

Load balancer:
----------------
A load balancer evenly distributes incoming traffic among web servers that are defined in a load-balanced set


Web Client/ App <=> load balancer => {
    privateIPWithInNetwor1: server1,
    privateIp2: server2
}


1. User connects to the public ip of load balancer directly, with this setup, web servers are unreachably directly by clients anymore.
2. For better sercurity, private ips are used for communication between servers
    a. private ip is an ip address reachably only betweem servers in the same network; however it is unreachable over the internet.
3. Load balancer communicates with web servers throgh private ips




After load balancer and a second server is added, we successfully solved no failover issue and impved the availability of the web tier.
    a. if server1 goes offline, all the traffic will be routed to server2. This prevents the website from going offline. 
        We also added a new healthy server to the server pool to balance the load
    b. If the website traffic grows rapidly, and two servers are not enough to hanlde the traffic,the load balancer can handle this problem gracefully.
        you only need to add more servers to the web server pool, and the load balancer automatically starts to send requests to them

Here, web tier looks good, what about the data tier?
The current design has one database, so it does not support failover and redundancy. Database replication is a common technique to address those problems. Let us take a look


Database Replication:

Database replication can be used in many database management systems, usally with a master/slave relationship between the original(master) and the copies(slave)

Master Db : supports write operations.
Slaves Db: gets copies of the data from the master database and only supports read operations.

All the data-modifying commands like : {
    insert,
    delete,
    update
}
must be sent to the master database. 

Most application require a much bigger ratio of read to write. Thus the number of slaves db in system is usally larger than the number of master databases.



                         Webserver 
                            |
                  -------------------------------
                 |                      
                 v writes operation      
                 |             Db Replication
                 V          |---------------->--- Slave Db
                 |          |  Db Replication 
                 MasterDB---| ---------------->-- Slave Db
                            |  Db Replication  
                            |----------------->-- Slave Db


Advantage of database replication:
1. Better performance:
     In the master -slave model, all writes and updates happen in master nodes; whereas read operation are distributed across the slave nodes.
     This model improves performance because it allows more queries to be processed in parallel.

2. Realiability: 
    If one of the database servers is  destroyed or goes offline, data is still preserved. Data loss is prevented

3. High availability:
    Even if a database is offiline you can access data stored in other db server.


If only we have 1 slave db, and that goes offiline, all the read operations will be redirected to the master db temporarily. 
Incase of availability of multiple slaves,  read operations are redirected to other healthy slaves.

If master goes offline, a slave db will be promoted to be a new master. All the db operations will be temporarily executed on the new master db.
In production, promoting a new master is more complicated as the data in the slave db might not be up to date. The missing data needs to be updated by running data recovery scripts. 
Some other replication methods like multi-masters and circular replication could help, those setups are more complicated.

                


Let's take a look at updated design so far:

    User (web | mobile client)
                ^    
                |
                v
             Load Balancer
            /           \
        Server 1      Server 2
        |        \  /       |
   write|         \/        |read
        |         /\        |
        V  write v  v read  v
        MasterDB <--> Slave DB
                   |
                replicated 



1. A user gets the ip address of the load balancer from DNS
2. A uesr connects load balancer
3. Web server request is routed by load balancer either to server1 or server2
4. Webserver reads user data from slave db
5. Webserver writes any data-modifying operations to the master database. This includes write, update, and delete operations.


------------------------    Now we have a solid understanding of the web and data tiers -------------------
Time to improve load/response time.

This can be done by:
1. Adding a cache layer 
2. Shifting static content (Javascript/css/image/video files) to the CDN






*/