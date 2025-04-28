import { Component, EventEmitter, HostListener, Input, Output, forwardRef } from "@angular/core"
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms"

@Component({
  selector: "app-input",
  templateUrl: "./input.component.html",
  styleUrl: "./input.component.scss",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = ""
  @Input() for = ""
  @Input() id = ""
  @Input() type = "text"
  @Input() value: any
  @Input() disabled = false
  @Input() placeholder = ""
  @Input() showLabel = false
  @Input() name = ""
  @Input() required = false
  @Input() invalid = false // Nova propriedade para indicar estado de erro

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>()
  @Output() blur = new EventEmitter<FocusEvent>();

  // Implementação do ControlValueAccessor
  private onChange: any = () => {}
  private onTouched: any = () => {}

  onInput(event: any) {
    this.value = event.target.value
    this.valueChange.emit(this.value)
    this.onChange(this.value)
  }

  // Métodos do ControlValueAccessor
  writeValue(value: any): void {
    this.value = value
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  // Método para marcar o campo como tocado
  markAsTouched() {
    this.onTouched()
  }

  @HostListener("focusout", ["$event"])
  _onBlur(event: FocusEvent) {
    this.onTouched();
    this.blur.emit(event);  
  }
}
