import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {BorrowedBookResponse} from '../../../../services/models/borrowed-book-response';
import {PageResponseBorrowedBookResponse} from '../../../../services/models/page-response-borrowed-book-response';
import {BookService} from '../../../../services/services/book.service';
import {FeedbackRequest} from '../../../../services/models/feedback-request';
import {FormsModule} from '@angular/forms';
import {RatingComponent} from '../../components/rating/rating.component';
import {RouterLink} from '@angular/router';
import {FeedbackService} from '../../../../services/services/feedback.service';

@Component({
  selector: 'app-borrowed-book-list',
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    RatingComponent,
  ],
  templateUrl: './borrowed-book-list.component.html',
  styleUrl: './borrowed-book-list.component.scss'
})
export class BorrowedBookListComponent implements OnInit{

  feedbackRequest: FeedbackRequest = {bookId: 0, comment: '', note: 0};
  borrowedBooks: PageResponseBorrowedBookResponse = {};
  page = 0;
  size = 5;
  selectedBook: BorrowedBookResponse | undefined = undefined;


  constructor(
    private bookService: BookService,
    private feedbackService: FeedbackService
  ) {
  }

  ngOnInit(): void {
      this.findAllBorrowedBooks();
  }


  returnedBorrowedBook(book: BorrowedBookResponse) {
    this.selectedBook = book;
    this.feedbackRequest.bookId = book.id as number;
  }

  private findAllBorrowedBooks() {
    this.bookService.findAllBorrowedBooks({
      page: this.page,
      size: this.size
    }).subscribe({
      next: (resp) =>{
        this.borrowedBooks = resp;
      }
    })
  }

  goToFirstPage() {
    this.page = 0;
    this.findAllBorrowedBooks();
  }

  goToPreviousPage() {
    this.page--;
    this.findAllBorrowedBooks();
  }

  goToPage(page: number) {
    this.page = page;
    this.findAllBorrowedBooks();
  }

  goToNextPage() {
    this.page++;
    this.findAllBorrowedBooks();
  }

  goToLastPage() {
    this.page = this.borrowedBooks.totalPages as number - 1;
    this.findAllBorrowedBooks();
  }

  get isLastPage(){
    return this.page == this.borrowedBooks.totalPages as number - 1;
  }

  returnBook(withFeedback: boolean) {
    this.bookService.returnBook({
      'book-id': this.selectedBook?.id as number
    }).subscribe({
      next: () => {
        if (withFeedback){
          this.giveFeedback();
        }
        this.selectedBook = undefined;
        this.findAllBorrowedBooks();
      }
    });
  }

  private giveFeedback() {
    this.feedbackService.saveFeedback({
      body: this.feedbackRequest
    }).subscribe({
      next: () => {

      }
    })
  }
}
