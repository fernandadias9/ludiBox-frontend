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
  @Input() maxlength?: number;
  @Input() numericOnly = false;

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>()
  @Output() blur = new EventEmitter<FocusEvent>();

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
}
