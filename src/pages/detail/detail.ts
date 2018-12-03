import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { post } from '../../entities/post';
import { comment } from '../../entities/comment';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  post: any;
  name: string;
  comments: comment[];
  aa: comment[] = [];
  constructor(public navCtrl: NavController,private http: Http, public navParams: NavParams) {
    this.post= navParams.get('post');
    this.name= navParams.get('name');
  }

  getComments(): Observable<comment[]>{
  return this.http.get("https://jsonplaceholder.typicode.com/comments")
      .map(responsee => responsee.json())
    //console.log(this.http.get("https://jsonplaceholder.typicode.com/posts"));
  //  .map(response => response.json());

  }

  takeComments(){
    this.getComments().subscribe( p=> {
      this.comments = p;
      console.log(this.comments);
      for (let com of this.comments) {
          if(com.postId == this.post.id){
            this.aa.push(com);
          }
        }
        console.log(this.aa);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
    this.takeComments();
  }

}
