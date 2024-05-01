Event Pass System

Tech stack:

- React Native (Front End)
- NestJS + GraphQL + Prisma
- MySQL
- Third Party library for QR Generation

User :

- Can signup with gmail
- they need to set a unique username
- can create event.
- can add visitors(users of the system) to event.
- User can generate pass for each visitors and share via app.
- Each pass has Entry count, valid number of scans associated to it.
- can scan the visitors QR code.
- QR code can be scanned only upto associated entry count after that it becomes invalid.
- Can see the list of events for which pass is assigned
- can click on the event to see the QR Code.

=================== Screens ======================

Events:

- Header Tabs: All Events / My Events
- List of Events
- Create Event button

Create / Edit Event:

- name

Profile:

- User info

=================== Database =======================

Event:

- id(PK)
- Name
- Description
- Venue
- Event Date
- Event Start Time
- Event End Time
- Event Time Duration
- Organiser(UserId)
- Photo
- created_at
- updated_at
- isExpired (If current date time exceeds the event end time it is not active)

User:

- id(PK)
- First Name
- Last Name
- Profile Photo
- username
- Mobile Number (Can Be Null)
- created_at
- updated_at

EventVisitors (You can decide the name):

- id(PK)
- QR_code (uuid)
- Event id
- visitor id
- Entries_Count (How many times this QR Code is allowed to scan)(Default 1)
- created_at
- updated_at

Scan:

- scan_id(PK)
- qr_id
- created_at
- updated_at
