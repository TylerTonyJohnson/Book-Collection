class Book {
  id = null;
  title = "";
  author = "";
  pageCount = null;
  finished = null;
}

class BookCollection {
  $bookList = $("book-list");
  books = [];

  add(book) {
    this.books.push(book);
    this.setIds();
    this.render();
    console.table(this.books);
  }

  remove(event) {
    console.log("removing" + event.target.id);
    
    // const ind = this.books.indexOf(book);
    // if (ind !== -1) {
    //   this.books.splice(ind, 1);
    //   this.setIds();
    //   this.render();
    // } else console.log("Cannot remove book from book collection");
  }

  setIds() {
    this.books.forEach((book, ind) => (book.id = ind));
  }

  submitBook() {
    console.log("Submitting Book");
    const newBook = new Book();
    newBook.title = $("title-input").value;
    newBook.author = $("author-input").value;
    newBook.pageCount = Number($("pages-input").value);
    newBook.finished = $("read-input").checked;

    console.log(newBook);
    this.add(newBook);
  }

  render() {
    // Clear current contents of HTML book list
    this.$bookList.innerHTML = "";

    // Create cards for every book and add to book list element
    this.books.forEach((book, ind) => {
      const $book = $("book-template").cloneNode(true);
      $book.id = "book" + ind;
      $book.hidden = false;
      $book.className = "book";
      $book.style.backgroundColor = "teal";


      this.$bookList.appendChild($book);
      // console.log($book);
    });

    // Create new book form from template in HTML
    const $addBookCont = $("add-book-container-template").cloneNode(true);
    $addBookCont.id = "add-book-container";
    $addBookCont.hidden = false;

    // Scrub "template" label from IDs of template form
    Array.from($addBookCont.children).forEach((element) => {
      element.id = element.id.replaceAll("-template", "");
    });

    this.$bookList.appendChild($addBookCont);
    addBtnVisible(true);
  }
}

// Event listeners
$("clear-button").addEventListener("click", () => console.log("Clearing!"));
$("load-button").addEventListener("click", () => console.log("Loading!"));
$("save-button").addEventListener("click", () => console.log("Saving!"));

// DOM element shorthand
function $(id) {
  return document.getElementById(id);
}
function $$(name) {
  return document.getElementsByName(name);
}

function addBtnVisible(isVis) {
  // Define button parts
  const $button = $("add-book-button");
  // Define form parts
  const $formComponents = Array.from($$("add-book-controls"));

  if (isVis) {
    // Enable button
    console.log("Making button visible");
    $button.firstElementChild.style.opacity = 1;
    $button.style.width = "33%";
    $button.style.height = "33%";
    $button.style.inset = "33%";
    $button.style.pointerEvents = "initial";

    // Disable form
    $formComponents.forEach((element) => {
      element.style.opacity = "0";
      element.style.pointerEvents = "none";
    });
  } else {
    console.log("Making form visible");

    // Disable button
    $button.firstElementChild.style.opacity = 0;
    $button.style.width = "100%";
    $button.style.height = "100%";
    $button.style.inset = "0%";
    $button.style.pointerEvents = "none";

    // Enable form
    $formComponents.forEach((element) => {
      element.style.opacity = "1";
      element.style.pointerEvents = "initial";
    });
  }
}

// Main code
let exampleBook1 = new Book();
exampleBook1.title = "Harry Potter and the Sorceror's Stone";
exampleBook1.author = "J. K. Rowling";
exampleBook1.pageCount = 309;
exampleBook1.finished = true;

let exampleBook2 = new Book();
exampleBook2.title = "The Origins and History of Consciousness";
exampleBook2.author = "Erich Neumann";
exampleBook2.pageCount = 493;
exampleBook2.finished = false;

let bookCollection = new BookCollection();
// bookCollection.render();
bookCollection.add(exampleBook1);
bookCollection.add(exampleBook2);
console.table(bookCollection.books);

addBtnVisible(true);
