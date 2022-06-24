import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { PostsListComponent } from './post-list/posts-list.component';
import { ShowPostsComponent } from './show-post/show-posts.component';
import { PostsFormComponent } from './post-form/posts-form.component';
import { HeaderComponent } from './header/header.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
//decorateur
@NgModule({
  //declaration des webcomponent
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    PostsListComponent,
    ShowPostsComponent,
    PostsFormComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  //declaration des services
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
