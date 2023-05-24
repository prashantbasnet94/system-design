/*



Cache:
    A cache is a temporary storage area that stores the result of expensive responses or frequently accessed data in memory so that subsequent request are served more quickly.
    Everytime a web pare loads, one or more db calls are executed to fetch data. Application performance is greatly affected by calling the db repeatedly. 
    Cache can mitigate this problem.


Cache Tier:
A cache tier is a temporary data store layer, much faster than the db.  Benefits of having a seperate cache tier include:
    i. Better system performance
    ii. Ability to reduce database workload
    iii. Ability to scale the cache tier independently.


Webserver : Cache {
         'check if cache has the available response' : sends cache present data back to the client
         'no response present in cache': queries db, stores the response in cache, and send it back to the client. 
}

This caching strategy is called read-throgh-cache.
Other caching strategy are available depending on the datatype,size and access patterns.

Interacting with cache servers is simple, as most cache servers provide apis

Example:
A typical memcached APIS:
cache.set('mykey', 'hi there')
cache.get('mykey')


Consideration for using cache:
1. Consider using cache when data is read frequently but modified infrequently. However, cache server is not ideal for persiting data, if cache server restarts all the 
    data in memory is lost. 

2. Expiration policy:
    It is good practice to implement expiration policy. 
        i. Once a cache data is expired, it is removed from the cache. 
        ii. When there is no expiration policy, cached data will be stored in the memmory permanently.
        iii. It is advisable not to make the expiration date too short as this may cause system to reload data from db too frequently.
        iv.  Meanwhile, it is advisable not to make the exipration data too long as the data can become stale.

3. Consistency:
    This invloves keeping the data store and the cache in sync. Inconsistency can happen because data-modifying operation are on the data store and cache are not in a single transaction.
    When scaling acorss multiple regions, maintaining consistency between the data store and cache is challenging.

4. Mitigating Failers:
    A single cache server represents a potential single point of failure(SPOF), if it fails, there will be huge load on the db, thus degrade the system performance.

    Another reommeneded approach is to overprovision the required memory by certain percentages. This provides a buffer as the memoery usage increases.

5. Eviction policy:
    Once the cache is full, any request to add items to the cache might cause existing items to be removed. This is called cache eviction.
    Least-recently-used is the most popular cache evition policy.
    Least-frequently-used, First-in-first-out(FIFO) can be adopeted to satisfy different use cases.







*/