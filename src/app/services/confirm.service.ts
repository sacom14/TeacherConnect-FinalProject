import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  private _confirmDelteElement = new BehaviorSubject<boolean>(false);

  get confirmDeleteElement() {
    return this._confirmDelteElement.asObservable();
  }

  constructor() { }

  public confirmDelete(){
    this._confirmDelteElement.next(true);
  }

  public cancelDelete(){
    this._confirmDelteElement.next(false);
  }

}
