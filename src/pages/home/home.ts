import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { post } from '../../entities/post';
import { user } from '../../entities/user';
import { DetailPage} from '../detail/detail';
import { databaseProvider } from '../../providers/database';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import "rxjs/add/operator/map";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  options: BarcodeScannerOptions;
  encodText: String = '';
  encodedData:any = {};
  scannedData:any = {};
  sayfa?: any;
  posts: post[];
  users: user[];
  datalar:any=[];
  datalarr: post[];
  constructor(public navCtrl: NavController,
              public scanner: BarcodeScanner,
              private http: Http,
              private platform: Platform,
              private storage: Storage,
              private database: databaseProvider
  ) {
      // this.storage.get('tableReady').then(veri =>{
      //   if (veri){
      //     this.database.getDatabaseStatus().subscribe(hzr =>{
      //       if(hzr){
      //           this.verileriListele();
      //         }else{
      //             this.verileriListele();
      //         }
      //
      //     })
      //   }
      // });
  }

  scan(){
    this.options = {
      prompt: "scan your barcod"
    };
    this.scanner.scan().then((data) => {
      this.scannedData = data;
    }, (error) => {
      console.log('error:',error);
    })
  }
  encode(){
    this.scanner.encode(this.scanner.Encode.TEXT_TYPE,this.encodText).then((data) => {
      this.encodedData = data;
    }, (error) => {
      console.log('error:',error);
    })
  }

verileriListele(){
  this.storage.get('tableReady').then(veri =>{
    if (veri){
      this.database.getDatabaseStatus().subscribe(hzr =>{
        if(hzr){
          console.log("this.datalarra girdi");
          this.database.getData().then(cvp =>{
            console.log("cvp üzeri");
            console.log(cvp);
            this.datalar = cvp

          });
          }else{
              console.log("olmadiiii");
          }

      })
    }
  });

}

  getPosts(): Observable<post[]>{
  return this.http.get("https://jsonplaceholder.typicode.com/posts")
      .map(response => response.json())
    //console.log(this.http.get("https://jsonplaceholder.typicode.com/posts"));
  //  .map(response => response.json());

  }

  veriAl(){
    this.getPosts().subscribe( p=> {
      this.posts = p;
        console.log(this.posts);
      this.database.getDatabaseStatus().subscribe(ready => {
        if (ready) {
          for (var i=0 ; i < this.posts.length; i++){
            this.database.addData(this.posts[i].id,this.posts[i].userId,this.posts[i].title,this.posts[i].body);
            console.log(this.posts[i].title);
          }
        }
      });
console.log("veri al calisti");
this.verileriListele();
    })

  }

  takePosts(){
    this.getPosts().subscribe( p=> {
      this.posts = p;
      console.log(this.posts);
    })
  }

  getUsers(): Observable<user[]>{
    return this.http.get("https://jsonplaceholder.typicode.com/users")
    .map(responseUser => responseUser.json())
  }

  getUsersList(){
    this.getUsers().subscribe( u=> {
      this.users = u;
      console.log(this.users);
    })
  }


  ionViewDidLoad() {
    this.getUsersList();
    this.takePosts();
  }

  goDetail(post,name:string){
    this.navCtrl.push(DetailPage, {
      post:post,
      name:name
    })
  }
}
