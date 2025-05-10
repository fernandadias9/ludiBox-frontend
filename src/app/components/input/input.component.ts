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
  @Input() name = ""
  @Input() required = false
  @Input() invalid = false 
  @Input() mask?: string
  @Input() maxlength?: number;
  @Input() numericOnly = false;
  @Input() customErrorMsg = '';
  @Input() showCustomError = false;
  @Input() currencyFormat = false;
  @Input() integerMaxLength = 4;

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>()
  @Output() blur = new EventEmitter<FocusEvent>();

  private rawValue = "";
  private onChange: any = () => {}
  private onTouched: any = () => {}

  onInput(event: any) {
    this.value = event.target.value
    this.valueChange.emit(this.value)
    this.onChange(this.value)
  }

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

  markAsTouched() {
    this.onTouched()
  }

  @HostListener("focusout", ["$event"])
  _onBlur(event: FocusEvent) {
    this.onTouched();
    this.blur.emit(event);
  }

  @HostListener("keypress", ["$event"])
  _onKeyPress(event: KeyboardEvent) {
    if (this.numericOnly && !/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener("keydown", ["$event"])
  onKeyDownCurrency(event: KeyboardEvent) {
    if (!this.currencyFormat) return;
    event.preventDefault();

    if (event.key === "Backspace" || event.key === "Delete") {
      this.rawValue = this.rawValue.slice(0, -1);

    } else if (/^[0-9]$/.test(event.key)) {
      const maxRaw = this.integerMaxLength + 2;
      if (this.rawValue.length < maxRaw) {
        this.rawValue += event.key;
      }
    } else {
      return;
    }

    const num = parseInt(this.rawValue || "0", 10) / 100;
    const [intPart, decPart] = num.toFixed(2).split(".");
    const formatted = `${intPart},${decPart}`;

    this.value = formatted;
    this.onChange(num);
    this.valueChange.emit(formatted);
  }
}
