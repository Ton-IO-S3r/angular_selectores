import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';
import { of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {
  
  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  })

  //Rellenar selectores.
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: string[] = [];
  constructor( private fb: FormBuilder, private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;
    this.miFormulario.get('region')?.valueChanges
        .pipe(
          tap( _ => {
            this.miFormulario.get('pais')?.reset('');
          }),
          switchMap( region => this.paisesService.getPaisesPorRegion(region))
          )
          .subscribe( paises => {
            this.paises = paises
          });
    this.miFormulario.get('pais')?.valueChanges
        .pipe(
          tap( _ => {
            this.miFormulario.get('frontera')?.reset('');
          }),
          
          switchMap( alpha => {
            return this.paisesService.getPaisPorAlpha3(alpha)
          })
        )
        .subscribe( pais => {
          this.fronteras = pais?.[0].borders || [];
        })
  }

  guardar = () => {
    console.log(this.miFormulario.value);
  }
}
