import { makeAutoObservable } from "mobx";

export default class BurgerStore {
  private _opened: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setOpened(opened: boolean): void {
    this._opened = opened;
  }

  toggleOpened(): void {
    this._opened = !this._opened;
  }

  get opened(): boolean {
    return this._opened;
  }
}
