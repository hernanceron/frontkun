import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private http: HttpClient) {}

  pods : any;

  ngOnInit() {

       this.http.get("http://localhost:8080/ecnf/project-generator/v1.0/ocp/jrvs-des/pods" ).pipe(
        retry(3)
      ).subscribe(data => {


      });
  }

}
