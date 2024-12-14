# Overview

This was a project where I was able to hook up Subabase to a previous frontend project so I could have a contact page with messages from users. This was a good way for me to apply SQL to my page in a way that is useful and helpful for such a site. I was able to spend a lot of time on hooking up the backend to the current UI. 

[Software Demo Video](https://youtu.be/lKGxBVmz1Us)

# Relational Database

I used Supabase PostgreSQL with one table called "Messages". Users can submit messages, which inserts them through the anon key, but when I login it gives me a token and that authorizes me to edit the table through the UI. The table has columns for id, first name, last name, email, topic, message, and is_complete. 

# Development Environment

I used VSCode on Windows, React JS, Express, and Supabase to develop this project. 

# Useful Websites


- [Supabase Docs](https://supabase.com/docs)
- [SQL Tutorial](https://www.w3schools.com/sql/)

# Future Work

- I would love to make a messaging page for users to login to to they can see their messages with me on the page rather than waiting for an email
- I would like to create an archive function where I can still see messages that are deleted, but not actually deleted so I could have a record of them.
- I could improve the filtering and sorting on the UI so I could filter by more than just names and could sort by each of the columns like date or alphabetically for topic or name. 