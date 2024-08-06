# Autopilot : Automating Linux Operating System With Autonomous AI Agents
___

### Problem Statement 
___ 
generally we can split the operations you can do on an Operating System into
two types, user-related operations like Searching the Web, Writing Code,
Emails or Documents ...etc. and system-related operations like managing filesystem, packages, networks, databases ..etc. 

for unexperienced user these operations can be complex and time consuming and for experienced one it will be boring and redundent. In addition as time goes the continues changing envoirnment of the OS posses a challenge in trying to maintain it. usually sys-admins use different commands/tools to maintain the os but using them may need extensive knowledge that isn't always known by the user. this creates a gap between three different types of users. non-technicals lack the skill 

whats un-common between these users is the experience versus the complixity they are faceing this 
challenge directly affects their Productivity and effictivness of completing the needed task.
However whats common between all users is the Natural Language and the different tasks they want to achieve.by utilizing these common ground we aim to map the natural language of these users to OS commands responsible for completing the different tasks for the users. to elimenate the gap of experience and boost the productivity and introduce precision and accuracy to these tasks.

### Aims 
___
through this project we aim to : 
1. Abstract the Complexity of Managing & Monitoring the OS 
2. Provide a Centralized Panel/Interface for Controlling the OS 
3. Enhance User Experience
4. Up Scaling the Productivity of regular users and developer
5. Introduce a new Way of Interacting with Operating Systems

### Objectives 
___
1. Building tools that reflect different OS modules 
2. Building a Knowledge Base(vector databse) holds needed information
2. Integrating these tools into sepreate Autonomous AI Agents 
3. Design a Workflow of interaction between these Agents 
4. Design a common web interface to interact with Agents 
5. Create checklist to test and evaluating the effectivness of Agents

### System Description 
___ 
The system is designed to innovate the way we interact with operating systems by offering a
centralized chat interface that recieve prompts from the user in their natural language and passes that prompt to the AI powered backend 
that breaks it down into actionable steps and dispatches them to the relevant agent responsible for executing those tasks. The agent 
then carries out the required actions within the system by executing corrosponding commands on the shell and returns the results.

Broadly speaking the system consists of three components: first, the user who initiates interactions with the system; second, the AI-driven backend that translates user prompts from natural language into operating system commands; and third, the OS shell, which provides a interface for executing commands and returning their results.

Furthermore the system is mainly composed of three interconnected components with each other the first is 
the user that prompts the system second is the AI backend that translates the prompt to OS commands
and the OS shell that provides us with an interface to execute commands and return results of those
commands.

### Context Diagram 
![context-diagram](./AutopilotContextDiagram.svg)

### Limitations & Contraints 

# Theoretical Background 🍿

## Abstraction
### Evolution through Abstraction
The Abstraction Principle is a fundamental concept in computer science; it states that complexity should be hidden, and only the essential features or functionalities of an object or system should be exposed to the outside world. In essence, this principle advocates for simplifying complex systems by identifying and isolating their underlying structures, properties, and behaviors, while providing a common interface.

By abstracting away irrelevant details, the Abstraction Principle enables engineers and users to focus on the essential aspects of a system, improving their ability to reason about and work with it effectively. If we take a closer look at the evolution of operating systems, we would come to the conclusion that abstraction played a great role in that evolution – from systems like MS-DOS abstracting away hardware complexity to a simple text-based interface, to GUIs like Windows and Linux that abstracted away the command-line interface to a graphical one. And we plan through this project to add an extra layer of abstraction, which comes in the form of a Web interface chat-bot that has full control over the system; its main responsibility is to translate users' natural language into system commands to complete essential tasks. Thus, abstracting the OS into an OS powered by Natural Language.

