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
  sauce$!: Observable<Post>;
  isAdmin$!: Observable<boolean>;
  userId!: string;
  likePending!: boolean;
  liked!: boolean;
  disliked!: boolean;
  errorMessage!: string;
  admin!: boolean;

  constructor(private sauces: PostsService,
    private route: ActivatedRoute,
    public auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.isAdmin$ = this.auth.isAdmin$;
    this.userId = this.auth.getUserId();
    this.loading = true;
    this.userId = this.auth.getUserId();
    this.sauce$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.sauces.getPostById(id)),
      tap(sauce => {
        this.loading = false;
        if (sauce.usersLiked.find(user => user === this.userId)) {
          this.liked = true;
        } else if (sauce.usersDisliked.find(user => user === this.userId)) {
          this.disliked = true;
        }
      })
    );
  }

  onLike() {
    if (this.disliked) {
      return;
    }
    this.likePending = true;
    this.sauce$.pipe(
      take(1),
      switchMap((sauce: Post) => this.sauces.likePost(sauce._id, !this.liked).pipe(
        tap(liked => {
          this.likePending = false;
          this.liked = liked;
        }),
        map(liked => ({ ...sauce, likes: liked ? sauce.likes + 1 : sauce.likes - 1 })),
        tap(sauce => this.sauce$ = of(sauce))
      )),
    ).subscribe();
  }

  onDislike() {
    if (this.liked) {
      return;
    }
    this.likePending = true;
    this.sauce$.pipe(
      take(1),
      switchMap((post: Post) => this.sauces.dislikePost(post._id, !this.disliked).pipe(
        tap(disliked => {
          this.likePending = false;
          this.disliked = disliked;
        }),
        map(disliked => ({ ...post, dislikes: disliked ? post.dislikes + 1 : post.dislikes - 1 })),
        tap(post => this.sauce$ = of(post))
      )),
    ).subscribe();
  }

  onBack() {
    this.router.navigate(['/posts']);
  }

  onModify() {
    this.sauce$.pipe(
      take(1),
      tap(post => this.router.navigate(['/update-post', post._id]))
    ).subscribe();
  }

  onDelete() {
    this.loading = true;
    let alert = confirm("Etes vous sur de vouloir supprimer ce post ?");
    if (alert) {
      this.sauce$.pipe(
        take(1),
        switchMap(sauce => this.sauces.deletePost(sauce._id)),
        tap(message => {
          console.log(message);
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
