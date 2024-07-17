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
### User Stories
The user will start on the homepage and either log in or sign up, then you can see the course page which will be able to click on the course and open the module layout which on the click of each module opens a modal with the topics inside of it and then on the click of these topics you can go to the learning page!
### Data Model/Server Endpoints
I am going to be linking a course page to its information within a database that will hold all the modules which hold all the topics and data for the course to be taught. I also want to use an api to use Facebook or Github to sign in and additionally I want cute dog pictures to be badges as you progress through courses and be held in your profile so I want to use a dog api.

For wireframes and data models go here: [document](https://docs.google.com/document/d/1ywcPyNcS8KWvNCQ4_xO7haq1eXU1e7XIXHo-tRQTjJI/edit?usp=sharing)

### Technical Challenge #1 - Code Sandbox
- [x] User can play with a code sandbox embed and pick languages to code in to further advance their skills


### Technical Challenge #2 - Chat Bot
- [ ] Using gemini API on the side of the code sandbox the user will have a chat bot that can help them with their code

### Nice to Have Features
- [ ] Showing a quiz at the end of each course
- [ ] Progress Bar
- [ ] Authors can edit Courses
