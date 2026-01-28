import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@splinetool/viewer';

@Component({
    selector: 'app-spline-scene',
    standalone: true,
    template: `
    <spline-viewer [attr.url]="sceneUrl" [attr.loading]="loading"></spline-viewer>
  `,
    styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    spline-viewer {
      width: 100%;
      height: 100%;
    }
  `],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SplineSceneComponent {
    @Input({ required: true }) sceneUrl: string = '';
    @Input() loading: 'auto' | 'lazy' | 'eager' = 'lazy';
}
