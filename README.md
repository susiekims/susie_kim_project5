# Budgit
A simple, no-nonsense expense tracker. [View live here](https://expense-tracker-v2.firebaseapp.com/).

## Getting started
Clone or download a copy of this repo to your local machine, and install dependencies.
```npm install```

## Component Breakdown
### Budget.js
Pulls list of categories from Firebase and renders them in separate "budget-card" divs. As of now, showHistory() is an unused function I am considering adding to later versions. 

### CategoryForm.js
The form component that allows users to enter new categories. Color picker is from https://github.com/casesandberg/react-color/. Allows user to input name, color, and budget for the category and pushes it to Firebase.

### Chart.js
Pie chart that accepts data from user transactions. From [React Chart.js](https://github.com/reactjs/react-chartjs).

### Dashboard.js
Dashboard once user logs in. Users can create and delete sheets, as well as access past sheets. 

### Header.js
Header used on both the dashboard page and each sheet page.

### Landing.js
Landing page, gives user a bit of info about Budgit and allows user to log in.

### Sheet.js
Where the majority of the magic happens. The parent component of Budget.js, CategoryForm.js, Table.js, and TableRow.js

### Table.js
Simple component that renders Table Rows.

### TableRow.js
Renders rows in the table according to data in Firebase. All text display are actually input elements, so any item can be modified at any time.

## Acknowledgements
[React Chart.js](https://github.com/reactjs/react-chartjs)
[React Color Picker](https://github.com/casesandberg/react-color/)
[Sweet Alert 2](https://github.com/sweetalert2/sweetalert2)
[Create-React-App](https://github.com/facebook/create-react-app)

