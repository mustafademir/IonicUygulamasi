import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Storage } from '@ionic/storage';
import { post } from '../entities/post';


  @Injectable()
 export class databaseProvider {
  private database: SQLiteObject;
  public databaseReady: BehaviorSubject<Boolean>;
  posts: post[];
  constructor(private  storage: Storage,
             private  sqlite: SQLite,
             private  platform: Platform) {
               this.databaseReady = new BehaviorSubject<Boolean>(false);
               this.platform.ready().then(() =>{
                 this.sqlite.create({
                   name: 'postDatabase',
                   location: 'default'
                 }).then((db: SQLiteObject) => {
                   this.database = db;
                   this.storage.get('tableReady').then(status =>{
                     if (status) {
                       this.databaseReady.next(true);
                     }else{
                       this.database.executeSql('CREATE TABLE posts(id INTEGER, userId INTEGER, title TEXT, body TEXT)',[])
                        .then(() => console.log('Executed SQL'))
                        .catch(e => console.log(e));
                        this.database.executeSql('CREATE TABLE users(id INTEGER, name TEXT, username TEXT)',[])
                         .then(() => console.log('Executed SQL'))
                         .catch(e => console.log(e));
                         this.database.executeSql('CREATE TABLE comments(postId INTEGER, id INTEGER, name TEXT, email TEXT , body TEXT)',[])
                          .then(() => console.log('Executed SQL'))
                          .catch(e => console.log(e));
                       this.databaseReady.next(true);
                       this.storage.set('tableReady',true);
                     }
                   })
                 })
               }).catch(e => console.log(e));
             }


             addData(userId,id,title,body){
               let data = [userId,id,title,body];
               return this.database.executeSql('INSERT or REPLACE INTO posts(id,userId,title,body) VALUES (?,?,?,?)',data)
                .then(res => {
                  console.log("veri eklendi");
                  return res;
                })
                .catch(e => console.log(e));
             }





             takeAllData(){
               console.log("hepsini ala girdi");
               return this.database.executeSql('SELECT id, userId, title, body FROM posts ',[]).then(res =>{
                 let data = [];
                 console.log(res);
                 if(res.rows.length > 0){
                   for(var i = 0; i >res.rows.length; i++){
                     let item = res.rows.item(i);

                    data.push({id: res.rows.item(i).id, userId: res.rows.item(i).userId, title: res.rows.item(i).title, body: res.rows.item(i).body})
                   }
                 }
                 return data;
               }, hata => {
                 console.log('hata olstu',hata);
                 return [];
               });
             }


             public getData() {

                return new Promise((resolve, reject) => {
                  this.database.executeSql('SELECT * from posts', []).then((data) => {
                    let activityValues = [];
                    if (data.rows.length > 0) {
                      for(let i=0; i <data.rows.length; i++) {
                        activityValues.push(data.rows.item(i).id, data.rows.item(i).userId, data.rows.item(i).title, data.rows.item(i).body);
                      }

                    }
                    return activityValues;
                }, (error) => {
                  return reject(error);
                });
              });


              }



             takeSingleLine(id,table){
               return this.database.executeSql('select * from posts where id = ' + id, []).then(res => {
                 let data = [];
                 console.log(res);
                 if(res.rows.length > 0){
                   for(var i = 0; i >res.rows.length; i++){
                     data.push({userId: res.rows.item(i).userId, id: res.rows.item(i).id, title: res.rows.item(i).title, body: res.rows.item(i).body})
                   }
                 }
                 return data;
               }).catch(e => console.log(e));
             }

             getDatabaseStatus(){
               return this.databaseReady.asObservable();
             }
}
