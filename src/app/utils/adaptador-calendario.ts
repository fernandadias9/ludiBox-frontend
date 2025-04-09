import { NativeDateAdapter } from "@angular/material/core"
import { Injectable } from "@angular/core"

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  constructor() {
    super("pt-BR")
  }

  override getDayOfWeekNames(style: "long" | "short" | "narrow"): string[] {
    return ["D", "S", "T", "Q", "Q", "S", "S"]
  }

  override getMonthNames(style: "long" | "short" | "narrow"): string[] {
    const monthNames = {
      long: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ],
      short: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
      narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    }

    return monthNames[style]
  }
}
