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


## Final Thoughts
I'm not going to say the previous 43 hours (which is how long I've been up for) haven't been especially demanding on my time (I lost all of Monday to some unexpected things I had to deal with), but I stil had the entire night, chunks of Tuesday day, and the evening up until now, so it'd be a lie to say there weren't 3+ hours in there for me to work on this. I'll set that aside.

In doing my own quick retro on this - quick for your sake, but I'll be thinking about it much longer - here it is:

### Went Well (maybe)
* I new know Playwright much much better than I did before
* I really seized on the idea of the whole process of creating a scraping workflow and integrate it "easily" intoand existing engine/platform. I analyzed the data available to me to try and figure-out what domain various ids belonged to. I consider the need for a form of universal vocabulary, comparing the two sites for differences and similarities (unconvering along the was things like the hidden SSN and how you could get some data that seemed to be on one site but missing from another), considering how I would account for things like GDPR. I considered much more than the bare minimum.
* I learned a a couple new thngs about the DOM. especially as it pertains to querying it to extract data.

### Didn't go well (or as I expected)
* Two key reasons I opted for Playwright were:
  * I planned to use the codegen features such that someone could accomplish a large part of scripting a scrape but running the tool against a site, click through various scenarios big and small while the tool created code including selectors (or locators) as you went, and then ideally you'd be able to take the "components" and stitch them together into a script (a function or some such) which would be made available to the engine and plugged in by adding some onfiguration
  * I also didn't relish the idea of hand-crafting a bunch of css selectors and knew the tool could help with that (I know the evtools provide some features here but it's a litle more clunky)
* To be fair, there are a LOT of non-testing features available in PW and I still consider it a viable option, but I think I was sunk for the following reasons in no particular order:
  * I was careful and deliberate about setting up my project - too deliberate. I didn't want to have to go back and redo things because I rushed through setting up PW
  * I was just a little unsure if the scope was sized as stated or if something bigger was expected, so I erred on the side of bigger, much bigger, including creating a configuration database of sort. I should've just asked (though the hours I was working did discourage me a little from asking a questiob that might notbe answed for 12 hours - but that's all on me)
  * PW does support jQ/CSS style selectors, but they also have an "easier" mechanism. Becoming familiar with that took some time and yielded less fruit than I'd like. Especially as I discovered that similar items were implemented differently - a span here (very challenging to get PW to locate them so I could exract them), so text over there, and I'm sure there was at least one other version, if not more, but the tools didn't really offer-up an obvious easy mechanism for grabbing those and so I flailed a little trying to find a good solution rather than going down the path of long twisty pseudo elements, especially as I burned time I didn't feel I had the luxury to take a step back and see some approach I was missing.

### Next steps
* I have no illusions that this is ultimately anything but a fail, but I'm still going to submit it
* It's a standard install, classic yarn, should be able to just clone it and run yarn. I'm almost positive I did nt run the PW install but let me check my history real quick... scratch that - I did run "yarn create playwright" and then also "yarn playwright install chromium" though I still ended-up with all the browsers.
* cli commands I ran the most:
  * npx ts-node src/app.ts (which runs it, but it'll chock on the second execution of one function which I'm currently guessing may have to do with a dirty context?)
  * npx playwright codegen --target=javascript --viewport-size="1400, 1200" https://scraping-interview.onrender.com/placeholder_carrier/f02dkl4e to run codegen. You can skip the target and the url but I'd keep the viewport-size
  * There are many other things the explore but I'm sure that's low on your priority list so....


Good Luck!

-Michael
