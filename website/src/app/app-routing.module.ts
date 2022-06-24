import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostsListComponent } from './post-list/posts-list.component';
import { PostsFormComponent } from './post-form/posts-form.component';
import { ShowPostsComponent } from './show-post/show-posts.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'posts', component: PostsListComponent, canActivate: [AuthGuard] },
  { path: 'post/:id', component: ShowPostsComponent, canActivate: [AuthGuard] },
  { path: 'new-post', component: PostsFormComponent, canActivate: [AuthGuard] },
  { path: 'update-post/:id', component: PostsFormComponent, canActivate: [AuthGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'posts'},
  { path: '**', redirectTo: 'posts' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
