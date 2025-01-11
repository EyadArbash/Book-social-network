import {Component, OnInit} from '@angular/core';
import {BookService} from '../../../../services/services/book.service';
import {Router} from '@angular/router';
import {PageResponseBookResponse} from '../../../../services/models/page-response-book-response';
import {NgForOf, NgIf} from '@angular/common';
import {BookCardComponent} from '../../components/book-card/book-card.component';
import {BookResponse} from '../../../../services/models/book-response';

@Component({
  selector: 'app-book-list',
  imports: [
    NgForOf,
    BookCardComponent,
    NgIf
  ],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit{

   bookResponse: PageResponseBookResponse = {};
   page = 0;
   size = 4;
   message = '';
   level = 'success';


  constructor(
    private bookService: BookService,
    private router:Router
  ) {
  }

  ngOnInit() {
    this.findAllbooks();
  }

  private findAllbooks() {
    this.bookService.findAllBooks(
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

  borrowBook(book: BookResponse) {
    this.message = '';
    this.bookService.borrowBook({
      'book-id': book.id as number
    }).subscribe({
      next: () => {
        this.level = 'success'
        this.message = 'Book successfully added to your list'
      },
      error: (err) => {
        console.log(err);
        this.level = 'error';
        this.message = err.error.error;
      }
    })
  }
}
