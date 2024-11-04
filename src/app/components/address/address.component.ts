import {
  Component,
  EventEmitter,
  inject,
  Input,
  model,
  OnDestroy,
  OnInit,
  Output,
  signal,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Address, City, Country } from '../../interfaces';

//angular material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { CityDialog } from '../city-dialog/city-dialog.component';
import { debounceTime, Subscription } from 'rxjs';
import { ClientService } from '../../services/client.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss',
})
export class AddressComponent implements OnInit, OnDestroy {
  @Input() address!: Address;
  @Output() removedAddress = new EventEmitter<number>();
  @Output() formUpdate = new EventEmitter<any>();

  readonly city = signal('');
  readonly dialog = inject(MatDialog);

  public addressForm!: FormGroup;
  public cities: City[] = [];
  public countries: Country[] = [];
  public hideRemoveButton = false;

  // unsubscribe to all subscriptions
  private _subscription = new Subscription();

  private _selectedCountryId = 0;

  constructor(
    private _fb: FormBuilder,
    private _clientService: ClientService,
    private _cdRef: ChangeDetectorRef,
    private _snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this._createAddressForm();
    this._getCountrys();
  }

  public removeAddress(): void {
    this.removedAddress.emit(this.address.id);
  }

  openCityDialog(): void {
    const country = this.countries.find(
      (country) => country.id == this.addressForm.value.countryId
    );

    if (!country) return;

    const dialogRef = this.dialog.open(CityDialog, {
      data: { country: country.name },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        const countryId = parseInt(this.addressForm.value.countryId);

        this._clientService.addCity(result, countryId).subscribe((data) => {
          this.city.set(result);
          this._getCities(countryId);
          this._snackbarService.open('City added successfully');
        });
      }
    });
  }

  private _createAddressForm(): void {
    this.hideRemoveButton = this.address.name === '' ? false : true;
    
    this.addressForm = this._fb.group({
      id: [this.address.id],
      name: [this.address.name, Validators.required],
      countryId: [this.address.countryId, Validators.required],
      city: [this.address.city, Validators.required],
      street: [this.address.street, Validators.required],
    });

    this._subscription.add(
      this.addressForm.valueChanges
        .pipe(debounceTime(500))
        .subscribe((data) => {
          this._getCities(data.countryId);
          this._onFormUpdate(data);
        })
    );
  }

  private _onFormUpdate(data: any): void {
    this.formUpdate.emit(data);
  }

  private _getCountrys(): void {
    this._subscription.add(
      this._clientService.getCountries().subscribe((data: any) => {
        this.countries = data;
        this._getCities(this.address.countryId);
      })
    );
  }

  private _getCities(countryId: number): void {
    if (!countryId && this._selectedCountryId !== countryId) return;

    this._selectedCountryId = countryId;

    this._subscription.add(
      this._clientService.getCities(countryId).subscribe((data: any) => {
        this.cities = data;
        const city = this.cities.find((city) => city.name === this.city());
        if (city) {
          this.addressForm.controls['city'].setValue(city.id);
        }
        this._cdRef.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {}
}
