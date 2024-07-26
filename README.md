# Code4All

Intern: **Ruby Oliveira**

Intern Manager: **Krithika Chandramouli**

Intern Director: **Sonia Uppal**

Peer(s): **Yiting Jiang and Riley Gowanlock**

## Overview

This application is aimed to give students an opportunity to learn the basics in CS for free!

Category: **Education**

Story: **An education app where students can sign up  and use free published courses that cover various topics in computer science**

Market: **Students curious about CS**

Habit: **To learn more about CS and how to start coding**

Scope: **The content will be centered on learning different coding languages and have simple code walkthroughs to use in an IDE in text and images, but out of scope will be videos and complex projects** 

## Product Specs
### User Stories
#### Required:
- [x] User can login
- [x] User can create an account
- [x] User can view all the offered courses
- [x] User can see an about of the course
- [x] User can use the self paced course
- [x] User can search for youtube videos for associated topics and view in the course
- [x] User can create a course with help of Gemini API and Unsplash API
#### Optional:
- [x] User can save progress in the course
- [x] User can save the courses for later
- [x] User passwords are encrypted in the database for security
- [x] Users can like courses
- [x] User can see course they've created
- [x] Only the Author can delete the course
      
### Data Model/Server Endpoints
The user will start on a landing page when logging in they will be on their course page which upon clicking a courses image they can enter the course and clicking on modules will open the topics. Additionally the user can create a course on the creation page, open a code sandbox, and look at profile information with personal data on courses saved, completed, created, and recommended to that user.

For wireframes and data models go here: [document](https://docs.google.com/document/d/1ywcPyNcS8KWvNCQ4_xO7haq1eXU1e7XIXHo-tRQTjJI/edit?usp=sharing)

### Technical Challenge #1 - Code Sandbox
- [x] User can play with a code sandbox embed and pick languages to code in to further advance their skills
- [x] Make codepad instantiatable and shareable
- [x] Auto save code at timed intervals
- [x] Optimize autosaving when user doesn't edit


### Technical Challenge #2 - Recommendation Algorithm
- [x] New user survey that recommends courses based on their responses
- [x] keyboard bindings: when you press right and left arrow keys it will direct through survey and to submit it will use enter button
- [x] Additionally, the user is able to go back and forth and edit their survey responses
- [x] On completion of course at the bottom of the topic it will give recommendations
- [x] Recommendations save to profile page so the user can go back and directly do their recommended courses
