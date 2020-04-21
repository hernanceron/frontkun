import {Injectable} from '@angular/core'
import { URLSearchParams, QueryEncoder, Http, Headers, Response, RequestOptions } from '@angular/http';
import { Router} from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'underscore';

export abstract class RequestMethod {
  static GET:string = "GET";
  static POST:string = "POST";
  static PUT:string = "PUT";
  static DELETE:string = "DELETE";
  static UPLOAD:string = "UPLOAD";
  static POST_WITHOUT_TOKEN="POST_WITHOUT_TOKEN";
}

class HttpRequest {
  method:string;
  url: string;
  data: any;

  constructor(method:string, url:string, data?:string) {
    this.method = method;
    this.url = url;
    if (data) {
      this.data = data;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: Http, private router: Router){}

  private buildHeaders(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  private buildHeadersWithoutToken(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  private doRequest(httpRequest:HttpRequest):Observable<Response> {
    let headers = this.buildHeaders();

    return Observable.fromPromise(new Promise<Response>((resolve, reject) => {
      let options = { headers: headers };
      switch(httpRequest.method) {
        case RequestMethod.GET:
          if (httpRequest.data) {
            let params: URLSearchParams = new URLSearchParams();
            _.each(httpRequest.data, function (value, key:any){
              params.set(key, <string>value);
            });
            options['search'] = params;
          }
          this.http.get(httpRequest.url, options).map(response => response).subscribe(x => {
            resolve(x)
          }, e => {
            reject(e);

          });
        break;
        case RequestMethod.POST:
          let json = JSON.stringify(httpRequest.data);
          this.http.post(httpRequest.url, json, options).map(x => x).subscribe(x => resolve(x),
           e => {
            reject(e)
          });
        break;

        case RequestMethod.POST_WITHOUT_TOKEN:
          let options2 = { headers: this.buildHeadersWithoutToken() };
          let json2 = JSON.stringify(httpRequest.data);
          this.http.post(httpRequest.url, json2, options2).map(x => x).subscribe(x => resolve(x), e => reject(e));
        break;

        case RequestMethod.DELETE:
          this.http.delete(httpRequest.url, options).map(x => x).subscribe(x => resolve(x),
           e => {
            reject(e)
          });
        break;
      }
    }).catch(e => {
      throw e;
    }));
  }

  get(url, params?:any):Observable<Response> {
    let req = new HttpRequest(RequestMethod.GET, url);
    if (params) {
      req.data = params;
    }
    return this.doRequest(req);
  }

  post(url, data):Observable<Response> {
    let req = new HttpRequest(RequestMethod.POST, url, data);
    return this.doRequest(req);
  }

  delete(url):Observable<Response> {
    let req = new HttpRequest(RequestMethod.DELETE, url);
    return this.doRequest(req);
  }

  post_without_token(url, data):Observable<Response> {
    let req = new HttpRequest(RequestMethod.POST_WITHOUT_TOKEN, url, data);
    return this.doRequest(req);
  }

} 