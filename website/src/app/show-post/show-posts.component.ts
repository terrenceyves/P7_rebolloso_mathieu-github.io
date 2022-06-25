import { Component, OnInit } from '@angular/core';
import { Post } from '../models/Post.model';
import { PostsService } from '../services/posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, EMPTY, map, Observable, of, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'app-single-post',
  templateUrl: './show-posts.component.html',
  styleUrls: ['./show-posts.component.scss']
})
export class ShowPostsComponent implements OnInit {

  loading!: boolean;
  post$!: Observable<Post>;
  isAdmin$!: Observable<boolean>;
  userId!: string;
  likePending!: boolean;
  liked!: boolean;
  disliked!: boolean;
  errorMessage!: string;
  admin!: boolean;

  constructor(private Post: PostsService,
    private route: ActivatedRoute,
    public auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    //Permet de checker si l'utilisateur est un admin
    this.isAdmin$ = this.auth.isAdmin$;

    this.userId = this.auth.getUserId();
    this.loading = true;
    this.userId = this.auth.getUserId();
    this.post$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.Post.getPostById(id)),
      tap(post => {
        this.loading = false;
        if (post.usersLiked.find(user => user === this.userId)) {
          this.liked = true;
        } else if (post.usersDisliked.find(user => user === this.userId)) {
          this.disliked = true;
        }
      })
    );
  }
// event binding
  onLike() {
    if (this.disliked) {
      return;
    }
    this.likePending = true;
    this.post$.pipe(
      take(1),
      switchMap((post: Post) => this.Post.likePost(post._id, !this.liked).pipe(
        tap(liked => {
          this.likePending = false;
          this.liked = liked;
        }),
        map(liked => ({ ...post, likes: liked ? post.likes + 1 : post.likes - 1 })),
        tap(post => this.post$ = of(post))
      )),
    ).subscribe();
  }
//event binding
  onDislike() {
    if (this.liked) {
      return;
    }
    this.likePending = true;
    this.post$.pipe(
      take(1),
      switchMap((post: Post) => this.Post.dislikePost(post._id, !this.disliked).pipe(
        tap(disliked => {
          this.likePending = false;
          this.disliked = disliked;
        }),
        map(disliked => ({ ...post, dislikes: disliked ? post.dislikes + 1 : post.dislikes - 1 })),
        tap(post => this.post$ = of(post))
      )),
    ).subscribe();
  }
//ertour en arriere event binding
  onBack() {
    this.router.navigate(['/posts']);
  }
//modification on event
  onModify() {
    this.post$.pipe(
      take(1),
      tap(post => this.router.navigate(['/update-post', post._id]))
    ).subscribe();
  }
//event binding
  onDelete() {
    this.loading = true;
    let alert = confirm("Etes vous sur de vouloir supprimer ce post ?");
    if (alert) {
      this.post$.pipe(
        take(1),
        switchMap(post => this.Post.deletePost(post._id)),
        tap(message => {
          this.loading = false;
          this.router.navigate(['/posts']);
        }),
        catchError(error => {
          this.loading = false;
          this.errorMessage = error.message;
          console.error(error);
          return EMPTY;
        })
      ).subscribe();
    } else {

    }
  }
}
