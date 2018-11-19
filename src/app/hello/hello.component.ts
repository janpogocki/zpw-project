import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css']
})
export class HelloComponent {
  // title = 'zpw-project';
  imie = 'Jan';
  nazwisko = 'Kowalski';

  tabliczka(tab1: string [], tab2: number []) {
    const list = [];

    for (const entry of tab1) {
      const subList = [];

      for (const subEntry of tab2) {
        subList.push(entry + subEntry);
      }

      list.push(subList);
    }

    return list;
  }
}
