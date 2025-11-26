import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { OAuthModule } from 'angular-oauth2-oidc';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,    
    RouterModule,
    BrowserModule,    
    DatePipe, 
    MarkdownModule.forRoot(),
    OAuthModule.forRoot()
  ],
  exports: [
    
  ]

})
export class AppModule { }
