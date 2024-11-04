import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Client } from '../../interfaces/client';

//angular material
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortable, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DatePipe } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    DatePipe,
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public displayedColumns = ['id', 'name', 'birthdate', 'addressCount'];

  public dataSource!: MatTableDataSource<Client>;
  public screenWidth = window.innerWidth;
  public selectedClient!: Client;
  // unsubscribe to all subscriptions
  private _subscription = new Subscription();

  constructor(
    private _clientService: ClientService,
    private _cdRef: ChangeDetectorRef,
    private _router: Router
  ) {}

  ngOnInit() {
    this._getClients();
  }

  public clientSelected(id: number): void {
    this._router.navigate([`/client/${id}`]);
  }

  public addNewClient(): void {
    this._router.navigate([`/client/new`]);
  }

  private _getClients() {
    this._subscription.add(
      this._clientService.getClients().subscribe((data: any) => {
        this.dataSource = new MatTableDataSource<Client>(data);
        this._cdRef.detectChanges();
        this._setDataSourceAttributes();
      })
    );
  }

  private _setDataSourceAttributes() {
    if (this.dataSource.paginator) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  ngOnDestroy() {
    this.dataSource?.disconnect();
    this._subscription.unsubscribe();
  }
}
