import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddressComponent } from '../address/address.component';
import { Subscription } from 'rxjs';
import { Address, Client } from '../../interfaces';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';

// angular material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from '../../services/snackbar.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    AddressComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
})
export class ClientComponent implements OnInit, OnDestroy {
  minDate = new Date(1900, 0, 1);
  maxDate = new Date();
  public clientForm!: FormGroup;
  public hideAddressButton = false;

  // unsubscribe to all subscriptions
  private _subscription = new Subscription();
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _clientService: ClientService,
    private _snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this._getClient();
  }

  public onSubmit(): void {
    if (this.clientForm.invalid) {
      return;
    }

    const client: Client = {
      id: this.clientForm.value.id,
      ...this.clientForm.value,
    };

    this._clientService.addClient(client).subscribe({
      next: (data) => {
        this._snackbarService.open('Client added successfully');
        this._router.navigate(['/']);
      },
    });
  }

  public addAdress(): void {
    const address = {
      id: 0,
      name: '',
      countryId: null,
      city: null,
      street: '',
    };

    const addressesArray = this.clientForm.get('addresses') as FormArray;

    addressesArray.push(
      this._fb.group({
        id: addressesArray.length + 1,
        name: [address.name, Validators.required],
        countryId: [address.countryId, Validators.required],
        city: [address.city, Validators.required],
        street: [address.street, Validators.required],
      })
    );
  }

  public removeAddress(id: number): void {
    if (this.clientForm.value.addresses.length === 1) {
      this.clientForm.value.addresses[0] = {
        name: '',
        countryId: null,
        city: null,
        street: '',
      };
    } else {
      const removeAddress = this.clientForm.value.addresses.findIndex(
        (address: Address) => address.id === id
      );

      const addressesArray = this.clientForm.get('addresses') as FormArray;
      addressesArray.removeAt(removeAddress);
    }
  }

  public backToClients(): void {
    this._router.navigate(['/clients']);
  }

  public onFormUpdate(data: any) {
    const addressesArray = this.clientForm.get('addresses') as FormArray;

    const index = addressesArray.controls.findIndex(
      (x) => x.value.id === data.id
    );

    addressesArray.controls[index].patchValue(data);
  }

  private _getClient(): void {
    const id = this._router.url.split('/')[2];
    if (id === 'new') {
      this._createClientForm({
        id: 0,
        name: '',
        birthdate: new Date(),
        addresses: [],
      });
    } else {
      const client = this._clientService.getClient(parseInt(id));
      this.hideAddressButton = true;
      this._createClientForm(client);
    }
  }

  private _createClientForm(client: Client): void {
    this.clientForm = this._fb.group({
      name: [client.name, Validators.required],
      birthdate: [client.birthdate, Validators.required],
      addresses: this._fb.array([]),
    });

    if (client.addresses.length > 0) {
      client.addresses.forEach((address: Address) => {
        const addressesArray = this.clientForm.get('addresses') as FormArray;
        const id = addressesArray.length + 1;
        addressesArray.push(
          this._fb.group({
            id: id,
            name: [address.name, Validators.required],
            countryId: [address.countryId, Validators.required],
            city: [address.city, Validators.required],
            street: [address.street, Validators.required],
          })
        );
      });
    } else {
      this.addAdress();
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
