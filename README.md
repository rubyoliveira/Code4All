# Code4All

[Watch the demo!](https://www.canva.com/design/DAGNHscA2Qs/fPvntP7Sp87fgATXgYe-Fw/edit?utm_content=DAGNHscA2Qs&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton](https://www.canva.com/design/DAGNHscA2Qs/Kh26gPza5q4EoaQHersG9Q/watch?utm_content=DAGNHscA2Qs&utm_campaign=designshare&utm_medium=link&utm_source=editor))

## Project Information

**Intern:** Ruby Oliveira  
**Intern Manager:** Krithika Chandramouli  
**Intern Director:** Sonia Uppal  
**Peers:** Yiting Jiang, Riley Gowanlock

## Overview

**Category:** Education  
**Story:** An educational app where students can sign up and access free published courses covering various topics in computer science for free.  
**Market:** Students curious about computer science (CS).  
**Habit:** To learn more about CS and how to start coding.  
**Scope:** The content focuses on learning different coding concepts. Through course content and youtube videos with the addition of a place to code and chat with a code copilot.

## Product Specifications

### User Stories

#### Required Features:
- [x] User can log in.
- [x] User can create an account.
- [x] User can view all the offered courses.
- [x] User can see detailed information about the courses.
- [x] User can take self-paced courses.
- [x] User can search for YouTube videos related to course topics and view them within the course.
- [x] User can create a course with the help of the Gemini API and Unsplash API.

#### Optional Features:
- [x] User can save progress in the course.
- [x] User can save courses for later.
- [x] User passwords are encrypted in the database for security.
- [x] Users can like courses.
- [x] User can see the courses they've created.
- [x] Only the author can delete their course.

### Data Model/Server Endpoints

Upon logging in, the user will start on a landing page and navigate to their course page. Clicking on a course image will allow them to enter the course and access the modules. Additionally, users can create courses on the creation page, open a code sandbox, and view profile information including saved, completed, and created courses, as well as recommended courses.

For wireframes and data models, refer to this [document](https://docs.google.com/document/d/1ywcPyNcS8KWvNCQ4_xO7haq1eXU1e7XIXHo-tRQTjJI/edit?usp=sharing).

### Technical Challenge #1 - Code Sandbox
- [x] User can use a code sandbox embed and select languages to code in to advance their skills.
- [x] User can chat with a code assistant.
- [x] Codepad is instantiable and shareable.
- [x] Code auto-saves at timed intervals.
- [x] Autosave is optimized to avoid saving when the user doesn't edit.

### Technical Challenge #2 - Recommendation Algorithm
- [x] New user survey recommends courses based on their responses.
- [x] Keyboard bindings: Right and left arrow keys navigate through the survey, and the Enter button submits responses.
- [x] Users can go back and forth to edit their survey responses.
- [x] Upon course completion, recommendations appear at the bottom of the topic.
- [x] Recommendations are saved to the profile page for direct access later.
