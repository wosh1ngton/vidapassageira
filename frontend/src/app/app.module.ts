import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { OAuthModule } from 'angular-oauth2-oidc';

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,    
    RouterModule,
    BrowserModule,    
    OAuthModule.forRoot()
  ],

})
export class AppModule { }
