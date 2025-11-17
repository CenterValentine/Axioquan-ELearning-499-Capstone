###
User Acceptance Observation – First Sprint

Overall, the first sprint looks good and the core functionalities are shaping up well. However, a few important issues need to be addressed as we move forward. These are outlined below:


1. Enrolment Button Functionality

Issue 1:
Given that a user is signed in as a student and selects a course,
When the student clicks the Enrol button,
Then the system should enrol the student in the selected course.
Observed Behavior: The button is currently inactive and only shows a hover state without performing any action.

Issue 2:
Given that a user who is not logged in visits the course page,
When they click the Enrol button,
Then the system should prompt the user to log in or sign up before proceeding with enrolment.
Observed Behavior: This login/signup prompt is not triggered.