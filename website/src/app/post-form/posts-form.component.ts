import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../services/posts.service';
import { Post } from '../models/Post.model';
import { AuthService } from '../services/auth.service';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-post-form',
  templateUrl: './posts-form.component.html',
  styleUrls: ['./posts-form.component.scss']
})
export class PostsFormComponent implements OnInit {

  sauceForm!: FormGroup;
  mode!: string;
  loading!: boolean;
  sauce!: Post;
  errorMsg!: string;
  imagePreview!: string;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private sauces: PostsService,
              private auth: AuthService) { }

  ngOnInit() {
    this.loading = true;
    this.route.params.pipe(
      switchMap(params => {
        if (!params['id']) {
          this.mode = 'new';
          this.initEmptyForm();
          this.loading = false;
          return EMPTY;
        } else {
          this.mode = 'edit';
          return this.sauces.getPostById(params['id'])
        }
      }),
      tap(sauce => {
        if (sauce) {
          this.sauce = sauce;
          this.initModifyForm(sauce);
          this.loading = false;
        }
      }),
      catchError(error => this.errorMsg = JSON.stringify(error))
    ).subscribe();
  }

  initEmptyForm() {
    this.sauceForm = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      image: [null, Validators.required],
    });
  }

  initModifyForm(sauce: Post) {
    this.sauceForm = this.formBuilder.group({
      name: [sauce.name, Validators.required],
      description: [sauce.description, Validators.required],
      image: [sauce.imageUrl, Validators.required],
    });
    this.imagePreview = this.sauce.imageUrl;
  }

  onSubmit() {
    this.loading = true;
    const newSauce = new Post();
    newSauce.name = this.sauceForm.get('name')!.value;
    newSauce.description = this.sauceForm.get('description')!.value;
    newSauce.userId = this.auth.getUserId();
    if (this.mode === 'new') {
      this.sauces.createPost(newSauce, this.sauceForm.get('image')!.value).pipe(
        tap(({ message }) => {
          console.log(message);
          this.loading = false;
          this.router.navigate(['/posts']);
        }),
        catchError(error => {
          console.error(error);
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      ).subscribe();
    } else if (this.mode === 'edit') {
      this.sauces.modifyPost(this.sauce._id, newSauce, this.sauceForm.get('image')!.value).pipe(
        tap(({ message }) => {
          console.log(message);
          this.loading = false;
          this.router.navigate(['/posts']);
        }),
        catchError(error => {
          console.error(error);
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      ).subscribe();
    }
  }

  onFileAdded(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.sauceForm.get('image')!.setValue(file);
    this.sauceForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
