import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {BookRequest} from '../../../../services/models/book-request';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BookService} from '../../../../services/services/book.service';

@Component({
  selector: 'app-manage-book',
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
    RouterLink
  ],
  templateUrl: './manage-book.component.html',
  styleUrls: ['./manage-book.component.scss']
})
export class ManageBookComponent implements OnInit{
  errorMsg: Array<string> = [];
  selectedPicture: string | undefined;
  selectedBookCover: any;
  bookRequest: BookRequest = {authorName: "", isbn: "", synopsis: "", title: ""};


  constructor(
    private bookService: BookService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
        const bookId = this.activatedRoute.snapshot.params['bookId'];
        if (bookId){
          this.bookService.findBookById({
            'book-id': bookId
          }).subscribe({
            next: (book) => {
              this.bookRequest = {
                id: book.id,
                title: book.title as string,
                authorName: book.authorName as string,
                isbn: book.isbn as string,
                synopsis: book.synopsis as string,
                shareable: book.shareable
              }
              if (book.cover){
                this.selectedPicture = 'data:image/jpg,base64, ' + book.cover;
              }
            }
          });
        }
    }

  onFileSelected(event: any) {
    this.selectedBookCover = event.target.files[0];
    console.log(this.selectedBookCover);
    if (this.selectedBookCover){
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture = reader.result as string;
      }
      reader.readAsDataURL(this.selectedBookCover);
    }
  }

  saveBook() {
    this.bookService.saveBook({
      body: this.bookRequest
    }).subscribe({
      next: (bookId)=> {
        this.bookService.uploadBookCoverPicture({
          'book-id': bookId,
          body: {
            file: this.selectedBookCover
          }
        }).subscribe({
          next: () => {
            this.router.navigate(['/books/my-books']);
          }
        })
      },
      error: (err) => {
        this.errorMsg = err.error.validationErrors;
      }
    })
  }
}
