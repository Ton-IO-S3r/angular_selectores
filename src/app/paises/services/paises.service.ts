import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  
  private _regiones: string[] = ["Africa", "Americas", "Asia", "Europe", "Oceania"]; 
  private _baseUrl: string = 'https://restcountries.com/v3.1';

  get regiones(){
    return [...this._regiones]
  }
  constructor(private http: HttpClient) { }

  getPaisesPorRegion = ( region: string ): Observable<PaisSmall[]> => {
    const url = `${this._baseUrl}/region/${region}?fields=name,cca3`;
    return this.http.get<PaisSmall[]>(url)
  }
  
  getPaisesPorAlpha3 = (codigo: string): Observable<Pais[] | null> => {
    if (!codigo) {
      return of(null)
    }
    const url = `${this._baseUrl}/alpha/${codigo}`;
    return this.http.get<Pais[]>(url);
  }
  getPaisPorAlpha3Small = (codigo: string): Observable<PaisSmall> => {

    const url = `${this._baseUrl}/alpha/${codigo}?fields=cca3,name`;
    return this.http.get<PaisSmall>(url);

  }

  getPaisesPorCodigos = (borders: string[]): Observable<PaisSmall[]> => {
    if (!borders) {
      return of([]);
    }
    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach(codigo => {
      const peticion = this.getPaisPorAlpha3Small(codigo);
      peticiones.push(peticion);
    });
    
    return combineLatest(peticiones);
  }
}
