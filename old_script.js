// General set up
const bookListElem = document.getElementById("book-list");
const clrBtnElem = document.getElementById("clear-button");

let bookCollection = [];

if (localStorage.getItem("bookCollection")) {
  loadAll();
  console.log("loading first time");
} else {
  console.log("creating example");
  let firstBook = new Book();
  firstBook.id = "book-0";
  firstBook.title = "The Origins and History of Consciousness";
  firstBook.author = "Eric Neuman";
  firstBook.pageCount = 500;
  firstBook.haveRead = false;

  bookCollection.push(firstBook);
  renderLibrary();
  createAddButton();
}

// Book prototype
function Book() {
  this.id = "";
  this.title = "Book Title";
  this.author = "Book Author";
  this.pageCount = 0;
  this.haveRead = false;
}

// Generate html for book
function gethtmlElement(book) { return (`
    <span name="close" class="material-icons close" onclick="removeBook(event)">close</span>
    <h2 name="title" class="book-text" contenteditable="true" oninput="editContent(event)">${book.title}</h2>
    <p name="author" class="book-text" contenteditable="true" oninput="editContent(event)">${book.author}</p>
    <p name="pages" class="book-text" contenteditable="true" oninput="editContent(event)">${book.pageCount}</p>
    <div class="read-div">
      <input id="disp-read" name="disp-read" ${book.haveRead ? "checked" : ""} type="checkbox" onchange="checkChange(event)"></input>
      <label for-"disp-read">${book.haveRead ? "Finished" : "Not finished yet"}</label>
    </div>
    `)}


// Clear button
clrBtnElem.addEventListener("click", (e) => {
  bookCollection = [];
  renderLibrary();
  createAddButton();
})

// Create plus button
function createAddButton() {

  const addButton = document.createElement("button");
  addButton.id = "add-book-button";
  addButton.className = "add-book-button";
  addButton.type = "button";
  addButton.addEventListener("click", enableAddBook);

  const addIcon = document.createElement("span");
  addIcon.id = "add-icon";
  addIcon.className = "material-icons centered";
  addIcon.innerHTML = "add";

  addButton.appendChild(addIcon);
  bookListElem.appendChild(addButton);
}

// Create form for new book
function enableAddBook(e) {

  // Create form
  const newBookForm = document.createElement("div");
  newBookForm.id = "new-book-form";
  newBookForm.className = "add-book-form";
  // newBookForm.className = "new-book-form";
  newBookForm.innerHTML = `
    <span name="close" class="material-icons close" onclick="removeSubmit()">close</span>
    <input id="title-input" type="text" required placeholder="Title" autocomplete="off" autofocus/>
    <input id="author-input" type="text" placeholder="Author" autocomplete="off"/>
    <input id="pages-input" type="number" placeholder="pages" autocomplete="off"/>
    <div class="read-div">
      <input id="read-input" name="read-input" type="checkbox"/>
      <span class="slider"></span>
      <label for="read-input">Finished</label>
    </div>
    <button id="submit-button" class="submit-button" type="button" onclick=submitBook(event)>Add Book</button>
    `;

  // Replace button with new form
  e.target.parentElement.replaceChild(newBookForm, e.target);
  newBookForm.classList.add("creating");
  document.getElementById("title-input").focus;
}

// Remove submit form
function removeSubmit() {
  bookListElem.removeChild(document.getElementById("new-book-form"));
  createAddButton();
}

// Submit new book
function submitBook() {
  let newBook = new Book();
  
  // Update new book with information inputs and update
  const titleInput = document.getElementById("title-input").value;
  const authorInput = document.getElementById("author-input").value;
  const pageCountInput = document.getElementById("pages-input").value;
  const haveReadInput = document.getElementById("read-input").checked;

  titleInput !== "" ? newBook.title = titleInput : newBook.title = "Unknown Title";
  authorInput !== "" ? newBook.author = authorInput : newBook.author = "Unknown Author";
  pageCountInput !== "" ? newBook.pageCount = pageCountInput + " pages" : newBook.pageCount = "Unknown page count";
  haveReadInput ? newBook.haveRead = true : newBook.haveRead = false;

  bookCollection.push(newBook);
  newBook.id = "book-" + bookCollection.indexOf(newBook);
  renderLibrary();
  createAddButton();
}

// Render the book collection to HTML
function renderLibrary() {

  // Remove all children
    while ( bookListElem.lastChild) {
      bookListElem.removeChild(bookListElem.lastChild);
    }
  
  // Load all children in the library
  bookCollection.forEach((book, i) => {
    const bookElem = document.createElement("div");
    bookElem.id = "book" + i;
    bookElem.className = "book";
    bookElem.style.backgroundColor = convertToColor(book.title);
    bookElem.style.color = contrastColor(convertToColor(book.title));
    bookElem.innerHTML = gethtmlElement(book);
    
    // Append new book element to the book collection
    bookListElem.appendChild(bookElem);
  });
}

// Check change function
function checkChange(e) {
  const bookElem = e.target.parentElement.parentElement;
  const targetBook = bookCollection[bookElem.id.slice(-1)];
  targetBook.haveRead = e.target.checked;
  renderLibrary();
  createAddButton();
}

// Remove book function
function removeBook(e) {

  // Get references to the 
  const bookElem = e.target.parentElement;
  const targetBook = bookCollection[bookElem.id.slice(-1)];

  bookElem.classList.add("deleting");
  bookElem.ontransitionend = () => {
    bookCollection.splice(bookCollection.indexOf(targetBook), 1);
    renderLibrary();
    createAddButton();
  }
}

// Edit content function
function editContent(e) {

  const currentElem = e.target;
  const parentElem = currentElem.parentElement;
  const targetBook = bookCollection[parentElem.id.slice(-1)];

  // Change object data
  targetBook[currentElem.getAttribute("name")] = currentElem.innerHTML; 

  // Change markup color
  let newColor = convertToColor(targetBook.title);
  parentElem.style.backgroundColor = newColor;
  parentElem.style.color = contrastColor(newColor);
  console.log(contrastColor(newColor));
  
}

// Convert any string to a color
function convertToColor(string = "111111") {
  let hexStr = "000000";
  for (let i = 0; i < string.length; i++) {
    let add = parseInt(string.charCodeAt(i), 16) * 100 ** (i % 3) - 30;

    // console.log(hexStr + " - " + add + " - " + i%3);
    hexStr = (parseInt(hexStr, 16) + add).toString(16);
  }
  while (hexStr.length < 6) {
    hexStr = "0" + hexStr;
  }
  return "#" + hexStr.substr(hexStr.length - 6);
}

// Invert color
function invertColor(hex) {
  // Remove hashtag
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }

  // Make into 6-character hex
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // If not 6 characters, get rid of color
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }

  // Split color, find inverse
  let r = (80 + parseInt(hex.slice(0, 2), 16)).toString(16).slice(-2),
    g = (80 + parseInt(hex.slice(2, 4), 16)).toString(16).slice(-2),
    b = (80 + parseInt(hex.slice(4, 6), 16)).toString(16).slice(-2);

  return "#" + padZero(r) + padZero(g) + padZero(b);
}

// Add padding to a string
function padZero(str, len = 2) {
  while (str.length < len) {
    str = "0" + str;
  }
  return str;
}

// Get black or white text - max contrast
function contrastColor(hex) {

  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }

  // Make into 6-character hex
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Convert hex to rgb
  let r = parseInt(hex.slice(0, 2), 16),
  g = parseInt(hex.slice(2, 4), 16),
  b = parseInt(hex.slice(4, 6), 16);

  // Calculate luminance, choose either white or black text
  let L = (r * 0.299 + g * 0.587 + b * 0.114);
  return  L > 186 ? '#000000' : '#FFFFFF';
}

// Disable saving html page
document.addEventListener("keydown", e => {
  if (e.key === "s" && e.ctrlKey === true) {
    e.preventDefault();
    saveAll();
  }
})

// Save button event handler
document.getElementById("save-button").addEventListener("click",saveAll);

function saveAll() {
  if (bookCollection.length > 0) {
    localStorage.setItem("bookCollection", JSON.stringify(bookCollection));
  } else {
    localStorage.removeItem("bookCollection");
  }
}

// Load button event handler
document.getElementById("load-button").addEventListener("click", loadAll);

function loadAll() {
  if (localStorage.getItem("bookCollection")) {
    bookCollection = JSON.parse(localStorage.getItem("bookCollection"));
  }
  renderLibrary();
  createAddButton();
}