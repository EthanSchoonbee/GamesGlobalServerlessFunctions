# Games Global - Technical Assessment - Serverless Functions 
<br />
<br />

## Author Details:

**Full Name** - *Ethan Schoonbee*

**University** - *Varsity College, Cape Town*

**Degree** - *Computer Science and Application Development*

**Year of Study** - *3rd Year (Final Year)*

**Email** - *schoonbeeethan@gmail.com*
<br />
<br />

## Table of Contents:
- Introduction
- Project Decisions
- Deploying Functions to AWS
- Conclusion

------------

## Introduction:
This project was developed as part of a technical assessment for Games Global and tested my practical implementation of AWS serverless functions.

For this project, I chose to take some risks and utilize **TypeScript** for my language of choice as I am currently trying to learn it.

I have also never utilized **Amazon AWS** or their cloud infrastructure platform before so I wanted to try it out for this project.
There were a lot of struggles with working out the intricacies of the AWS service, particularly with understanding how VPCs and services outside of them
interact with each other, but I am glad I took the chance and tried it out as it was a great learning experience.
<br />
<br />


## Project Decisions:
In this section, I want to explain some of the critical choices I made throughout the project:

###   Choice of Tech Stack
- **Runtime Environment:**

  - I opted for **Node.js ** for its asynchronous nature, which is particularly useful for handling API requests efficiently. Additionally, the availability of libraries for **AWS** integration made it a great fit.
- **Database Selection:**

  - **DynamoDB** was chosen because of its seamless integration with AWS services and its flexibility in managing JSON-like structures.
- **Validation with Zod:**

  - I chose **Zod** for input validation to ensure the API requests adhere to a defined schema, improving the robustness of the **Lambda** **functions**.

###   Deployment
- **GitHub Action Pipeline:**

  - I chose to use **GitHub Actions** and set up a deployment pipeline to automatically deploy the AWS environment and lambda functions to a specified AWS account.
  - This only works in GitHub, as secrets and variables must be added to the forked repository to build correctly.
  - I did this under the assumption that because we are required to push the code to GitHub, the evaluators would have access to a GitHub account and therefore
can deploy from it.
<br />
<br />

## Deploying Functions to AWS:
To deploy the serverless functions to AWS, follow these steps:

###1. Create a AWS Account
I wont guide you through the creation but ensure you have an AWS account before proceeding.

###2. 
<br />
<br />

## Conclusion:
This project provided a valuable opportunity to explore serverless architectures, and I gained hands-on experience with AWS Lambda and DynamoDB. The lessons learned in scalability and efficient resource management will guide future projects. I hope this serves as a solid foundation for building scalable, serverless applications.
