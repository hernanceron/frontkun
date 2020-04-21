import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  projectSelected: String = 'TCH' ;

  hasHazelcast: boolean ;
  hasWebservice: boolean ;
  hasHost: Boolean = false;

  resources: Array<string> = [];

  servicename: String = 'Dummy';
  artifactId: String = 'dummy-artifactid';
  groupid: String = 'com.pacifico.ms';
  description: String = 'generación automatica de servicios';
  packagebase: String = 'com.pacifico.ms.services';

  constructor(private http: HttpClient) {}

  onKeydown(event) {
     const val = event.target.value;
     if (val !== '') {
       this.resources.push(event.target.value);
       event.target.value = '';
     }
  }

  removeResource(i) {
    if (i > -1) {
      this.resources.splice(i, 1);
    }
  }

  ngOnInit( ) {
  }

  checkedTypeProject(typeProject: string){
    this.projectSelected = typeProject;
  }

  checkedDependency(dep: string) {
    if (dep === 'h') {
      this.hasHost = !this.hasHost;
    }
    if (dep === 'w') {
      this.hasWebservice = !this.hasWebservice;
    }
    if (dep === 'hz') {
      this.hasHazelcast = !this.hasHazelcast;
    }
  }

  download( ) {
    const headers = new HttpHeaders().set('request-id', '22332612222');
    this.http.post('http://localhost:9090/ecnf/project-generator/v1.0/projects',
      this.getEntity() , { headers : headers, responseType: 'arraybuffer' })
       .pipe(retry(3))
       .subscribe(data => {
          const blob = new Blob([data], {  type: 'application/zip' });
          const url = window.URL.createObjectURL(blob);
          window.open(url, 'blank');
      });
  }

  getEntity() {
    const outputdir = 'cross-services-party-data-management'; // 'project';
    const dependencies = [];
    const fragment = [];
    for (let i = 0; i < this.resources.length; i++) {
        const packagedir = 'com.pacifico.ms';
        fragment.push({
            'outputdir' : 'project/src/main/java/' + packagedir.replace(/\./g, '/') + '/',
            'resourcename' : this.resources[i],
            'maintemplate' : 'resource'
        });

        fragment.push({
            'outputdir' : 'project/src/main/java/' + packagedir.replace(/\./g, '/') + '/web/',
            'resourcename' : this.resources[i],
            'maintemplate' : 'web'
        });
    }

    const body = {
        'domain_service' : 'party-data-management',
        'domain_business' : 'party',
        'packagebase' : this.packagebase, // 'com.pacifico.ms',
        'mavendescription' : this.description,
        'outputdir' : outputdir,
        'api_version' : '1.0.0',

        'mavengroupId' : this.groupid,
        'dependencies' : dependencies,
        'fragment' : fragment,

        'application_name' : 'cross-services-party-data-management',
        'mavenartifactId' : 'party-data-management',
        'mavenversion' : '1.0-SNAPSHOT',

        'mavenname' : 'party-data-management',
        'servicename' : this.servicename,
        'maintemplate' : this.projectSelected
      };

      return body;
  }

}
