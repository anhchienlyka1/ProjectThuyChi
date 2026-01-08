import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { IconsModule } from '../icons/icons.module';

@Component({
    selector: 'kid-input',
    standalone: true,
    imports: [CommonModule, IconsModule, FormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => KidInputComponent),
            multi: true
        }
    ],
    template: `
    <div class="flex flex-col gap-2 w-full">
      <label *ngIf="label" class="text-xl font-bold text-kid-text ml-4">{{ label }}</label>
      <div
        class="relative flex items-center transition-all duration-300 transform"
        [class.scale-105]="isFocused"
      >
        <!-- Icon Prefix -->
        <div *ngIf="iconName" class="absolute left-4 text-gray-400 z-10 pointer-events-none transition-colors duration-300" [class.text-kid-accent]="isFocused">
           <lucide-icon [name]="iconName" [size]="24" [strokeWidth]="3"></lucide-icon>
        </div>

        <input
          type="text"
          [placeholder]="placeholder"
          [value]="value"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          [disabled]="isDisabled"
          class="w-full h-16 rounded-2xl border-[3px] border-gray-300 bg-white px-6 text-xl text-kid-text placeholder-gray-300 outline-none transition-all duration-300"
          [class.pl-14]="iconName"
          [class.border-kid-accent]="isFocused"
          [class.shadow-lg]="isFocused"
          [class.shadow-kid-accent/20]="isFocused"
        />
      </div>
    </div>
  `
})
export class KidInputComponent implements ControlValueAccessor {
    @Input() label?: string;
    @Input() placeholder: string = '';
    @Input() iconName?: string;

    value: string = '';
    isDisabled: boolean = false;
    isFocused: boolean = false;

    onChange = (value: string) => { };
    onTouched = () => { };

    onInput(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.value = value;
        this.onChange(value);
    }

    onFocus() {
        this.isFocused = true;
    }

    onBlur() {
        this.isFocused = false;
        this.onTouched();
    }

    writeValue(value: string): void {
        this.value = value || '';
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }
}
