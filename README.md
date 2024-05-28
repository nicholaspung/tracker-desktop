# README

## General idea

The idea is to make the desktop app a local first phenomena. To do this, that means everything should start off in local, and then the data can be synced to a server sometime afterwards.

In order to do this, a design decision must be made on the structure of the data - do we want to attach users to the data, or should we make it so that if someone decides to sync their data, we then attach the users to the data there, before syncing up to the server.

There are complexities for the second one. It generally makes more sense for a user to create an account, and to have the user be attached to all the data so that the data can be synced easier later. However, the hard part is how do you make sure the user is unique to the server?

If the idea is that we provide a syncing service for users to have, and that when they decide to pay for the syncing service, we spin up their own server with their own credentials, then we provide it to them, but we don't have access to anything, except that if they are paying money, the service is up, and once they stop paying money, then service is down, then the following should happen:

- If they decide to pay for syncing service, they are required to change their user's password to something they want
- In addition, we will also encrypt all their data when it gets transferred to the server
- The syncing process will only start once they change their password, their service is up and running. Then in the syncing process, the data will be replicated and encrypted along the way, so that only the user with the new password would be able to access it

Ultimately, I think the decision will be on the desktop, no user will be attached to data. But when a user decides to buy the syncing service, the app will tell them to create an account, which will then attach their user to the data sent up to the server. And during the sync process, it will use the new credentials. So generally, desktop has no user attached, sync service has user attached, if one application was offline, then it writes to a collection queue sorted by time (UTC) and then provides any conflicts to the user locally in a separate "review" page