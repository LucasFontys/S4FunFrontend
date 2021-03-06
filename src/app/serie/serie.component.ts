import { Component, OnInit } from '@angular/core';
import { ShowService } from '../services/show-service';
import { LoginService } from '../services/login-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Serie } from '../models/serie';
import PNotify from 'pnotify/dist/es/PNotify';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
PNotify.defaults.styling = 'bootstrap3'; // Bootstrap version 3
PNotify.defaults.icons = 'bootstrap3'; // glyphicons

@Component({
  selector: 'app-serie',
  templateUrl: './serie.component.html',
  styleUrls: ['./serie.component.css']
})
export class SerieComponent implements OnInit {
  private userId: number;
  public Shows: any;
  show: any;
  id: any;
  private commentTitle: any;
  private commentBody: any;

  constructor(private showService: ShowService, private loginService: LoginService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    PNotifyButtons; // Initiate the module. Important!

    this.commentTitle = "";
    this.commentBody = "";

    console.log("ngOnInit");
    const params = this.activatedRoute.snapshot.params;
    console.log("paramsId", params.id);
    if (params.id) {
      this.showService.getShows(params.id).subscribe((val) => {
        this.Shows = val;
        console.log("shows", this.Shows);
        this.Shows.forEach(element => {
          console.log("show", element)
        });

        if (!Array.isArray(this.Shows) || !this.Shows.length) {
          var notice = PNotify.info({
            title: 'You have no shows added!',
            text: 'Search for a show, in the search bar top right.',
            modules: {
              Buttons: {
                closer: false,
                sticker: false
              }
            }
          });
          notice.on('click', function () {
            notice.close();
          });
        }
      });

      this.id = params.id;

    }


  }

  remove(show) {
    console.log("button werkt");
    this.showService.removeShow(show, this.id);
    console.log("any", show);
    let list: Array<Object> = this.Shows;
    list = list.filter(obj => obj !== show);
    this.Shows = list;

    var notice = PNotify.success({
      title: 'Removed!',
      text: 'You removed it succesfully!',
      modules: {
        Buttons: {
          closer: false,
          sticker: false
        }
      }
    });
    notice.on('click', function () {
      notice.close();
    });

  }

  moreInfo(show) {
    console.log("show", show);
    this.router.navigate(['search-details/' + show.mediaType + '/' + show.tmdbId + "/" + "true"])
    // routerLink="/search-details/{{serie.media_type}}/{{serie.id}}"
  }

  postComment(show) {
    console.log(this.commentTitle);
    console.log(this.commentBody);
    this.showService.postComment(show, this.commentTitle, this.commentBody).subscribe((val) => {
      const params = this.activatedRoute.snapshot.params;
      this.showService.getShows(params.id).subscribe((val) => {
        this.Shows = val;
      });

    });

  }
}
