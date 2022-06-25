import { Component, OnInit } from '@angular/core';
import { PostsService } from '../services/posts.service';
import {catchError, map, Observable, of, switchMap, take, tap} from 'rxjs';
import {Post} from '../models/Post.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit {

  postsArray$!: Observable<Post[]>;
  post$!: Observable<Post>;
  userId!: string;
  loading!: boolean;
  errorMsg!: string;
  likePending!: boolean;
  liked!: boolean;
  disliked!: boolean;

  constructor(private Post: PostsService,
              private route: ActivatedRoute,
              public auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.userId = this.auth.getUserId();
    this.postsArray$ = this.Post.posts$.pipe(
      tap(post => {
        this.loading = false;
        this.errorMsg = '';
        if (post[0].usersLiked.find(user => user === this.userId)) {
          this.liked = true;
        } else if (post[0].usersLiked.find(user => user === this.userId)) {
          this.disliked = true;
        }
      }),
      catchError(error => {
        this.errorMsg = JSON.stringify(error);
        this.loading = false;
        return of([]);
      })
    );
    this.Post.getPosts();
  }
//event binding
  onClickPost(id: string) {
    this.router.navigate(['/post', id]);
  }

}
