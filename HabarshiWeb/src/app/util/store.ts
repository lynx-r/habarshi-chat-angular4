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
  }

  public static get(key: string): any {
    let value = JSON.parse(localStorage.getItem(key));
    if (value === "undefined" || value === "null") {
      return null;
    }
    return value;
  }
}
