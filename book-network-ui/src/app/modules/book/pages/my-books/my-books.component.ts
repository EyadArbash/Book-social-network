import {Component, OnInit} from '@angular/core';
import {BookCardComponent} from '../../components/book-card/book-card.component';
import {NgForOf, NgIf} from '@angular/common';
import {PageResponseBookResponse} from '../../../../services/models/page-response-book-response';
import {BookService} from '../../../../services/services/book.service';
import {Router, RouterLink} from '@angular/router';
import {BookResponse} from '../../../../services/models/book-response';

@Component({
  selector: 'app-my-books',
  imports: [
    BookCardComponent,
    NgForOf,
    RouterLink
  ],
  templateUrl: './my-books.component.html',
  styleUrl: './my-books.component.scss'
})
export class MyBooksComponent implements OnInit{
  bookResponse: PageResponseBookResponse = {};
  page = 0;
  size = 4;



  constructor(
    private bookService: BookService,
    private router:Router
  ) {
  }

  ngOnInit() {
    this.findAllbooks();
  }

  private findAllbooks() {
    this.bookService.findBooksByOwner(
      {
        page: this.page,
        size: this.size
      }
    ).subscribe(
      {
        next: (books) => {
          console.log('Geladene Bücher:', books);
          this.bookResponse = books;
        }
      }
    )
  }

  goToFirstPage() {
    this.page = 0;
    this.findAllbooks();
  }

  goToPreviousPage() {
    this.page--;
    this.findAllbooks();
  }

  goToPage(page: number) {
    this.page = page;
    this.findAllbooks();
  }

  goToNextPage() {
    this.page++;
    this.findAllbooks();
  }

  goToLastPage() {
    this.page = this.bookResponse.totalPages as number - 1;
    this.findAllbooks();
  }

  get isLastPage(){
    return this.page == this.bookResponse.totalPages as number - 1;
  }

  archiveBook(book: BookResponse) {
    this.bookService.updateArchivedeStatus({
      'book-id': book.id as number
    }).subscribe({
      next: () => {
        book.archived = !book.archived;
      }
    });
  }

  shareBook(book: BookResponse) {
    this.bookService.updateShareableStatus({
      'book-id': book.id as number
    }).subscribe({
      next:() => {
        book.shareable = !book.shareable;
      }
    });
  }

  editBook(book: BookResponse) {
    this.router.navigate(['books', 'manage', book.id]);
  }
}
