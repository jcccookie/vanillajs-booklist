// Class for book info
class Book{
   constructor(title, author, isbn){
      this.title = title;
      this.author = author;
      this.isbn = isbn;
   }
}

// Class for UI
class UI{
   addBookToList(book){
      // Get book list container
      const list = document.querySelector('#book-list');
      // Create table row
      const row = document.createElement('tr');
      //Put book info to table data as text in table row
      row.innerHTML = `
         <td>${book.title}</td>
         <td>${book.author}</td>
         <td>${book.isbn}</td>
         <td><a href="#" class="delete">X</a></td>
      `;
      //Append row to container
      list.appendChild(row);
   }

   clearField(){
      document.querySelector('#title').value = '';
      document.querySelector('#author').value = '';
      document.querySelector('#isbn').value= '';
   }

   showAlert(msg, className){
      const div = document.createElement('div');
      div.className = `alert ${className}`;
      div.appendChild(document.createTextNode(msg));

      const container = document.querySelector('.container');
      const form = document.querySelector('#book-form');

      container.insertBefore(div, form);

      setTimeout(function(){
         document.querySelector('.alert').remove();
      }, 3000);
   }

   deleteBook(target){
      if(target.className === 'delete'){
         target.parentElement.parentElement.remove();
      }
   }
}

// Class for Local Storage
class Store{
   static getBook(){
      let books;
      if(localStorage.getItem('books') === null){
         books = [];
      }
      else{
         books = JSON.parse(localStorage.getItem('books'));
      }
      return books;
   }
   static displayBooks(){
      const books = Store.getBook();

      books.forEach(book => {
         const ui = new UI();
         ui.addBookToList(book);
      })
   }
   static storeBookToLocalStorage(book){
      const books = Store.getBook();

      books.push(book);

      localStorage.setItem('books', JSON.stringify(books));
   }
   static removeBookFromLocalStorage(isbn){
      const books = Store.getBook();

      books.forEach((book, index) => {
         if(book.isbn === isbn){
            books.splice(index, 1);
         }
      })
      localStorage.setItem('books', JSON.stringify(books));
   }  
}
document.addEventListener('DOMContentLoaded', Store.displayBooks());

document.querySelector('#book-form').addEventListener('submit', function(e){
   // Assign Element to variables
   const title = document.querySelector('#title').value;
   const author = document.querySelector('#author').value;
   const isbn = document.querySelector('#isbn').value;
   
   // Create UI instance
   const ui = new UI();

   //if input field is empty
   if(title === '' || author === '' || isbn === ''){
      // Show alert
      ui.showAlert('Please fill out the all fields', 'error');
   }
   else{
      // Create Book instance
      const book = new Book(title, author, isbn);
      // Add book to list
      ui.addBookToList(book);
      // Add book to local storage
      Store.storeBookToLocalStorage(book);
      // Clear input field
      ui.clearField();
      // Show alert that book added
      ui.showAlert('Book Added!!', 'success');
   }

   e.preventDefault();
})

document.querySelector('#book-list').addEventListener('click', function(e){
   const ui = new UI();
   // Delete book from list
   ui.deleteBook(e.target);   
   // Remove book from Local Storage
   Store.removeBookFromLocalStorage(e.target.parentElement.previousElementSibling.textContent);
   // Show alert
   ui.showAlert('Book Removed!!', 'success');

   e.preventDefault();
})