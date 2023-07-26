import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { DataList, DataResponse } from '../_models';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getListData() :Observable<DataResponse>{
    return this.http.get<DataResponse>('../assets/data.json');
  }
}
