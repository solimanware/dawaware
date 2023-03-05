import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_URL } from '../global';
import { Drug } from '../pages/home/home.page';

interface Drugs {
  drugs: Drug[];
}
@Injectable({
  providedIn: 'root',
})
export class DrugsService {
  drugs: Drug[] = [];
  constructor(private http: HttpClient) {}

  getDrugs(): Observable<Drug[]> {
    return (
      this.http
        .get<Drugs>(API_URL)
        //take the data from the response from drug key
        .pipe(
          map((response: Drugs) => {
            this.drugs = response.drugs;
            return response.drugs;
          })
        )
    );
  }
}
