# Michael Haan Submission
## adapt-api-haanm

### Assumptions (or maybe questions)
* Scaping is done on an intermittant, regular and configurable - per Agency and Carrier - basis
* By Agency because it seems
* Going to assume we should support an ad-hoc scrape for a given user
### Considerations / Assumptions
* The project has us scraping Carrier pages but Agencies are the customer (for now) so we're mimicking scraping a web interface the Agency has to view accounts they have with that carrier.
* The pages we're scraping also include information about a single agent and a single customer, so it's unknown what other pages could theoretically exist to view all the poicies an agency has with a carrier, or for an agent to view a list of the policies they manage either for a giveen carrier or (more likely) a carrier designation for each policy.
* An ad hoc retrieval capability *could* be a valuable feature (I imagine it would be if it was reliable and relatively fast, but I don't know this from the users) but it wouldn't make sense for that to be the only or primary data retrieval use case.
* The primary data retrieval is some sort of batch job (and by batch, I don't mean being able to scrape a single screen and grab batches of data, which would be better. I mean a job that runs and attempts to retrieve the desired data for every policy an agency has - yes, most likely for a given carrier but I'm not making that distinction yet) which upon completion will have (ideally) retrieved the policy information for all the agencie's policies and produced an audit report (in reality the "job" will have captured and recorded details as it ran which would then be automatically compared against existing agency data to idenify changes, red flags etc which should feed a monioring and alerting platform and also cproduces human readable audit reports) the automated side of which could be set to retry failed policy retrievals but at the very least a report would exist that highlighted any failures.
* Which brings to mind a few thoughts:
  * Without knowing more, I'd say the newly downloaded data should not automatically overwrite the existing data and even with (or without) automatic updating the existing data (needs to be preserved for some amount of time).
  *  This implies a manual step is required to "OK" the integration of the new data.
  *  **Howver**, most of what I've been considering is based on data being stored in a traditional RDBMS. Considering the mocked sites, each has a list of what are either transactions against a single policy or the current information on all the policies for that customer (from the carrier). We could talk about the best way to identify and order (by time) any new data (and without knowing more, there may be some outliers where this can't be done automatically) and rather than just pushing it into an RDBMS, you instead run some sanity checks on it and write the new transactions to an event store (we might need a little logic, a small state machine maybe, to infer what it is which could be mitifated by storing the original newly downloaded information in compacted json as part of the new event) which, depending on the rest of the system, means we isolate the new data for (along with checkpoints) easy rollback, integration into a larger state machine (which admittedly does not require the event store step) that can automate many tasks (I think Zapier is already in house?) including procative agent notifications and a whole bumch of the things you're probably already doing or planning to - the point is remove the issues with a relational DB (we can and I'm sure do CQRS this down the line to add features back in) and the non-starter "data download approval process"
* I went with Playwright over the fast boilerplate approach because I think it offers so much softens cost of the "tech debt bill is coming due" inflection point. I also think, but can't know without knowing more about what you're working with, that there are several ways to close the perforrmance gap. I also think the codegen capabilites may be a real boon to the democratizon of this.
* I'm guessing that "Producer Code" is a unique agent ID but it probably isn't. Easily swapped out.
* I'm not handling auth for now but built in a little room for it
* Don't love the current "dynamic" url setup but could see adapting it after implementing auth to then go *somewhere* because we're working with the idea that it's dynamic







# TypeScript Boilerplate

## How to use

[Download Node](https://nodejs.org/en/) if you don't already have it on your machine

### Scripts

`yarn start`: compiles `index.ts` and runs it