package com.librarymanagementsystem.librarymanagementSystem.Controller;

import com.librarymanagementsystem.librarymanagementSystem.Entity.AuthorEntity;
import com.librarymanagementsystem.librarymanagementSystem.Entity.BookEntity;
import com.librarymanagementsystem.librarymanagementSystem.Entity.MemberEntity;
import com.librarymanagementsystem.librarymanagementSystem.Exception.ResourceNotFoundException;
import com.librarymanagementsystem.librarymanagementSystem.Service.LibraryService;
import com.librarymanagementsystem.librarymanagementSystem.Service.LibraryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/library")
public class LibraryController {

        @Autowired
        private LibraryServiceImpl libraryService;

        // ✅ Add a new author
        @PostMapping("/authors")
        public AuthorEntity addAuthor(@RequestBody AuthorEntity author) {
            return libraryService.addAuthor(author);
        }

        @DeleteMapping("/authors/{authorId}")
        public String deleteAuthor(@PathVariable Long authorId) throws ResourceNotFoundException {
            libraryService.deleteAuthor(authorId);
            return "Author deleted successfully!";
        }


    // ✅ Add a new book (linked with existing author)
        @PostMapping("/books/{authorId}")
        public BookEntity addBook(@RequestBody BookEntity book, @PathVariable Long authorId) throws ResourceNotFoundException {
            return libraryService.addBook(book, authorId);
        }

        // ✅ Add a new member
        @PostMapping("/members")
        public MemberEntity addMember(@RequestBody MemberEntity member) {
            return libraryService.addMember(member);
        }

        // ✅ Borrow a book
        @PostMapping("/borrow/{memberId}/{bookId}")
        public String borrowBook(@PathVariable Long memberId, @PathVariable Long bookId) throws ResourceNotFoundException {
            libraryService.borrowBook(memberId, bookId);
            return "Book borrowed successfully!";
        }

        // ✅ Get all borrowed books for a member
        @GetMapping("/members/{memberId}/borrowed-books")
        public List<BookEntity> getBorrowedBooks(@PathVariable Long memberId) throws ResourceNotFoundException {
            return libraryService.getBorrowedBooksByMember(memberId);
        }

        @GetMapping("/authors")
        public ResponseEntity<List<AuthorEntity>> getAllAuthors() {
            return ResponseEntity.ok(libraryService.getAllAuthors());
        }

        // -----------------------------
        // Optional: get full list of books
        // -----------------------------
        @GetMapping("/books")
        public ResponseEntity<List<BookEntity>> getAllBooks() {
            return ResponseEntity.ok(libraryService.getAllBooks());
        }
}