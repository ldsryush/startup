/!\\ hey future TAs! this is abby. this student had repo issues but we got it all fixed.<br>
they have +64 commits over on **main**, this branch is a continuation of that i promise<br>
:)

# Oyee Marketplace

[My Notes](notes.md)
*learned about the basics of github
*created a ssh key
*learned how to pull and push from vs code
*Read about the basics of commits
*Learned about html
*Learned how to link my domain name with my ip address
*Learned how to make a permanent ip address for my website.
*Solved my commit issue
* Created input, index, media html. That has the structures of my website.
*messed around with html settings and how do create links to 3rd party websites
*Learned how to put in images, videos, and change colors.
*Learned about CSS
*Learned how to change colors for screen, font, background etc.
*Editing CSS is pretty straight forward
*Font-style, font-size, text-align and put the desired change afterwards
header - flex: 0 80px - Zero means it will not grow and 80px means it has a starting basis height of 80 pixels. This creates a fixed size box.
footer - flex: 0 30px - Like the header it will not grow and has a height of 30 pixels.
main - flex: 1 - One means it will get one fractional unit of growth, and since it is the only child with a non-zero growth value, it will get all the remaining space. Main also gets some additional properties because we want it to also be a flexbox container for the controls and content area. So we set its display to be flex and specify the flex-direction to be row so that the children are oriented side by side.
Flex is used to delimit the header, main, and footer elements. This makes them responsive to different screen sizes.
The use of absolute positioning relative to the parent element for the game controls.
The selection based on class attributes to style elements.
The override of Bootstrap in order to keep the menu from changing the flex direction to column on small screens.
The use of @media selectors to hide content when the screen is too small.
Learned about react and bootstrap.
How to deploy react and how it works with js. 
Component-Based Architecture:

React applications are built using components, which are self-contained modules that define the UI and behavior for a small part of your application. Components can be composed together to create complex UIs.

Virtual DOM:

React uses a virtual DOM to improve performance. Instead of directly manipulating the browser's DOM, React creates a virtual representation of it. When the state of an object changes, React updates the virtual DOM first, then efficiently updates the actual DOM to match.

JSX (JavaScript XML):

JSX is a syntax extension for JavaScript that looks similar to XML or HTML. It allows you to write HTML structures within JavaScript code, making it easier to create and understand the UI components.

Unidirectional Data Flow:

React follows a unidirectional data flow, meaning that data flows in one direction, from parent to child components. This makes it easier to understand and debug your applications.

State and Props:

State is an object that holds data that may change over the lifetime of the component. Props (short for properties) are read-only attributes used to pass data from parent to child components.

Lifecycle Methods:

React components go through a lifecycle of events, such as mounting, updating, and unmounting. Lifecycle methods allow you to run code at specific points during a component's lifecycle.

Hooks:

React Hooks are functions that let you use state and other React features in functional components. Some commonly used hooks are useState, useEffect, and useContext.
SMTP & Email Configuration:

Learned how to set up environment-specific email transporters with Nodemailer:

Development: Use Ethereal for testing emails.

Production: Use AWS SES (or similar SMTP providers) with proper environment variables (e.g., SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS).

Configured your deployment script (or environment) to export these environment variables so that your backend uses them in production.

Error Debugging & Module Resolution:

Troubleshot a MODULE_NOT_FOUND error by verifying your file structure and ensuring that all required modules (e.g., connectToDatabase.js) were in the expected locations.

Adjusted file paths for CSS imports in React, ensuring that components import their styles using relative paths (e.g., import "../equipment/equipment.css";).

React Component Best Practices:

Moved CSS imports from the HTML file to the corresponding React component files (e.g., Equipment.jsx and Apparel.jsx) to support modular and component-scoped styling.

Ensured that state is passed correctly via props. For example, passing the logged-in user’s email from App.jsx to Equipment.jsx and Apparel.jsx, so that messaging functions correctly.

Uniform Image Sizing with CSS:

Learned to enforce a consistent image size using CSS properties:

Set fixed width and height (e.g., 200px).

Used object-fit: cover to crop images appropriately without distortion.

Applied these styles uniformly for images across different components (both equipment and apparel).

WebSocket Integration for Real-Time Chat:

Integrated WebSocket connections to enable real-time messaging within your components.

Established dynamic WebSocket URLs based on your environment (development vs production).

Conditional Rendering & UI Enhancements:

Modified Equipment.jsx and Apparel.jsx to show a chatbox only for the selected item:

When "Message Seller" is clicked, the selected item is stored in state.

The chatbox is conditionally rendered inside the specific item’s <li> element, directly under the "Message Seller" button.

Ensured that messages are filtered and displayed only for the selected item.

Project Structure & Routing:

Configured your main App.jsx to pass required information (e.g., the user's email) as props to child components like Equipment.jsx and Apparel.jsx.

Set up React Router to navigate between different pages (e.g., Home, Apparel, Equipment, Sell, Messages) while maintaining authentication state.
## 🚀 Specification Deliverable

> [!NOTE]
>  Fill in this sections as the submission artifact for this deliverable. You can refer to this [example](https://github.com/webprogramming260/startup-example/blob/main/README.md) for inspiration.

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] Proper use of Markdown
- [x] A concise and compelling elevator pitch
- [x] Description of key features
- [x] Description of how you will use each technology
- [x] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references.

### Elevator pitch
Winter sports have a high paywall that may intimidate some people from entering the sport. While there are lots of broad resell markets like facebook marketplace which lets people buy items second-hand at a discount of retail price, it is hard for first timers to research about the items and come to a good conclusion. My website will be a secondhand marketplace designed specifically for winter sport equipment. It will let users buy items at a discount while letting sellers get rid of their old unwanted items. There will also be a link using google image searching to give the buyer a link to a website that has reviews/specs for the product they are interested in to give them what they want.


### Design
![0](https://github.com/user-attachments/assets/34bb3e93-7410-444b-a1eb-b6230855c7fb)



### Key features
- Lets users message each other about the item
- Direct link to research about their item 
- Let's people get over the high paywall most winter sports have
 

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Use the correct HTML structure for the application.Two HTML pages. One for login and one for creating links to the websites with reviews/specs for the product.
- **CSS** - Application styling to make it look good on varying screen size, good whitespace, color choice, contrast, layout, positioning, and fonts.
- **React** - Login form, navigation bar, home page, contact page. 
- **Service** - translation service, authenticating the user.
- **DB/Login** - Store users and searches in database. Register and login users. Credentials are stored in database. Can't message unless authenticated.
- **WebSocket** - chat application between users.

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Server deployed and accessible with custom domain name** -(https://oyeemarket.click).

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **HTML pages** - I added an index.html, input.html, and media.html pages to my website.
- [x] **Proper HTML element usage** - I researched and applied proper html element usage to my .html pages.
- [x] **Links** - I added links to my github, my startup repoisitory, and a link to a video about snowboarding.
- [x] **Text** - I added the name of my website, information about what you can look at.
- [x] **3rd party API placeholder** - I added a API placeholder in my index.html.
- [x] **Images** - I added a basic image that related to the purpose of my website at index.html
- [x] **Login placeholder** - I added a login place holder in index.html .
- [x] **DB data placeholder** - I added a placeholder that I can later integrate to use actual data.
- [x] **WebSocket placeholder** - I added a placeholder that I can later go in and use actual data for.

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Header, footer, and main content body** - I did complete this part of the deliverable.
- [x] **Navigation elements** - I did complete this part of the deliverable.
- [x] **Responsive to window resizing** - I did complete this part of the deliverable.
- [x] **Application elements** - I did complete this part of the deliverable.
- [x] **Application text content** - I did complete this part of the deliverable.
- [x] **Application images** - I did complete this part of the deliverable.

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Bundled using Vite** - I bundled using Vite after I changed the title to my name, changed the counter to increment by 10, and the background color.
- [x] **Components** -I created a fork at CodePen and added a state variable and background color.
- [x] **Router** - Routing between login and voting components.

## 🚀 React part 2: Reactivity

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **All functionality implemented or mocked out** - I converted various HTML files into React components, utilizing useState for state management and useEffect for lifecycle events. The app includes components for login, play, marketplaces, input forms, media content, and selling items. I also integrated mock websocket and API calls from a mockdatabase. For 3rd party services I downloaded a json-server and created a mock database to use for information regarding password resets.  Consistent CSS styling ensures a responsive design, transforming static HTML into a dynamic, interactive React application.
- [x] **Hooks** - I implemented various React hooks to manage the state and lifecycle events of the components. For useState i implemented an authorization for login that changes between login/"welcome user". For useEffect I added an chatbox simulation that mocks a conversation between a potential buyer and the seller when you click on message seller.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Node.js/Express HTTP service** created a backend server that manages my images, calling in a 3rd party service, and etc.
- [x] **Static middleware for frontend** - store all of my images from my website in one folder and call to it from multiple different parts from my frontend. 
- [x] **Calls to third party endpoints** - Called to third party endpoints in backend to fetch the local weather in orem to display in my homepage. 
- [x] **BackenD service endpoints** - user authentication that lets users sign up, reset password by sending reset code to backend terminal, and login to sell items and chat with other users.
- [x] **Frontend calls service endpoints** - user authentication also applies here as it uses both backend and frontend. Let users signup, reset password, certain things locked for only users like selling items and chatting!

## 🚀 DB/Login deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **User registration** - Users are able to register and the registered information is stored in my Mongodb for future use.
- [x] **User login and logout** - User can now login to list items for sale and logout when they choose to do so.
- [x] **Stores data in MongoDB** - My Mongodb now stores user email, password, name, and products listed for sale. 
- [x] **Stores credentials in MongoDB** - My Mongodb stores user credentials in my users database.
- [x] **Restricts functionality based on authentication** - If users are not authenticated by logging in, they cannot list items for sale. 

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Backend listens for WebSocket connection** - Backend listens for Websocket connection and correctly sends messages to be stored to my mongo db.
- [x] **Frontend makes WebSocket connection** - My messages page correctly shows chatlogs as well as let user chat with eachother about the item of interest.
- [x] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [x] **WebSocket data displayed** - Both buyer and seller can both see the chat history and what time they sent the message.
- [x] **Application is fully functional** - Application if fully functional in letting users sign up, reset password, log in, list items, and talk to potential sellers/buyers.
