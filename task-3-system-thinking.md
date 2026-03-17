### Question 1: Scaling

If this API starts getting thousands of requests per minute, these are likely problems:

Server resource will be totally consumed (CPU/RAM)
The app may slow down or crash if one server handles too many requests at once. Response times increase, and some requests may time out.

In-memory storage limitations
Since tasks are stored in memory, data is not shared across multiple instances and is lost on restart. At scale, this causes inconsistency and reliability issues.

Heavy traffic and api abuse risk
Without rate limiting, a few heavy users or bots can flood the API and degrade service for normal users.

Growing data will slow api operations
As the in-memory task list grows, filtering/searching through arrays becomes slower, increasing latency for endpoints like GET /tasks.

### Question 2 : Performance Improvements

Move from in-memory storage to a database
Use a real DB like PostgreSQL so data is persistent, queryable, and can handle larger datasets better than arrays in memory.

Add database indexing
Create indexes on frequently filtered fields (eg assignedTo and status) so reads are faster.

Use caching for frequent reads
Cache common responses (eg task lists) with Redis to reduce repeated database work.

Add pagination and filtering by default
Avoid returning very large task lists at once; use limit/offset or cursor pagination to reduce response size and memory usage.

Use async/non-blocking patterns carefully
Keep request handlers lightweight, avoid heavy synchronous work, and move expensive tasks to background jobs if needed.

Enable rate limiting
Protect the API from abuse/spikes so one client cannot consume too many resources and degrade performance for others.

### Question 3 : Production Monitoring

i'll do the following;

Monitor average response times per endpoint to detect slow APIs early.

Monitor percentage of failed requests to catch bugs or bad actors quickly.

Monitor Server resource usage

Monitor service availability and failed health checks so downtime is detected immediately.

Database metrics, Monitor query latency, slow queries, connection pool usage, lock/contention, and DB CPU/memory.