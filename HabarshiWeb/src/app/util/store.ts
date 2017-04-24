import { Injectable } from '@angular/core';

export class Store {

  constructor() { }

  public static put(key: string, value: any) {
    if (value == null) {
      localStorage.setItem(key, null);
      return;
    }
    let data = JSON.stringify(value);
    localStorage.setItem(key, data);
    console.log('Put in store: ' + data)
  }

  public static get(key: string): any {
    let value = JSON.parse(localStorage.getItem(key));
    if (value === "undefined" || value === "null") {
      return null;
    }
    console.log('Get from store: ' + value);
    return value;
  }
}
