import { Injectable } from '@angular/core';
import { Client } from '../interfaces/client';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Address } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private _clients: Client[] = [];

  constructor(private _http: HttpClient) {}

  // Get all clients
  public getClients(): Observable<Client[]> {
    return this._http.get<Client[]>(`${environment.apiUrl}/persons`).pipe(
      map((data) => {
        this._clients = data;
        return data;
      })
    );
  }

  // Get client by id
  public getClient(id: number): Client {
    return (
      this._clients.find((client) => client.id === id) ||
      ({
        id: 0,
        name: '',
        birthdate: new Date(),
        addresses: [],
      } as Client)
    );
  }

  // Add client
  public addClient(client: Client): Observable<Client> {
    return this._http.post<Client>(`${environment.apiUrl}/person`, client);
  }

  // Get countries
  public getCountries(): Observable<string[]> {
    return this._http.get<string[]>(`${environment.apiUrl}/countries`);
  }

  // Get cities by country id
  public getCities(id: number): Observable<string[]> {
    return this._http.get<string[]>(`${environment.apiUrl}/cities/${id}`);
  }

  // Add city
  public addCity(city: string, countryId: number): Observable<string> {
    return this._http.post<string>(`${environment.apiUrl}/city`, {
      name: city,
      countryId,
    });
  }
}
