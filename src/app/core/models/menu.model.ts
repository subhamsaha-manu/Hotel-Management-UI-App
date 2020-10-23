import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

export class Menu{
    constructor(
        public id : number,
        public name : string,
        public isActive : boolean
    ){}
  }


  @Injectable({
      providedIn:"root"
  })
  
  export class MenuAdapter implements Adapter<Menu> {

    adapt(item : any):Menu{
        return new Menu(item.id,item.name,item.isActive);
    }
  }