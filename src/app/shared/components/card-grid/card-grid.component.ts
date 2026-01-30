import { Component, input } from "@angular/core";

@Component({
  selector: "svi-card-grid",
  standalone: true,
  templateUrl: "./card-grid.component.html",
  styleUrl: "./card-grid.component.scss"
})
export class CardGridComponent {
  readonly minWidth = input<string>("20rem");
  readonly maxWidth = input<string>("24rem");
  readonly gap = input<string>("1.5rem");
  readonly margin = input<boolean>(true);
}
