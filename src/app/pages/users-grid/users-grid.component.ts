import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/data-service.service';
import { User } from '../../shared/User.interface';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-users-grid',
  templateUrl: './users-grid.component.html',
  styleUrl: './users-grid.component.scss',
})
export class UsersGridComponent implements OnInit {
  constructor(private dataService: DataService, private router: Router,private translate: TranslateService) {}
  users: User[] = [];
  isOpen: boolean = false;
  types = [      
    this.translate.instant('user'),
    this.translate.instant('doctor'),
    this.translate.instant('admin'),
  ];
  public url = 'http://localhost:5134/Upload/Files/';
  params = history.state.params;
  role!: string;
  categories: any;
  AddCategory = false;
  EditCategory = false;
  CategoryId!: number;
  inputValue!: string;
  categoryId!: number;
  public isCategoryUsed!: string;

  ngOnInit(): void {
    if (history.state.params === 'რეგისტრაცია') {
      this.role = 'USER';
    } else if (
      history.state.params === 'ექიმები'||
      history.state.params === 'კატეგორიები'
    ) {
      this.role = 'DOCTOR';
    }

    this.dataService.getByRoles(this.role).subscribe({
      next: (response) => {
        this.users = response;
      },
      error: (error) => {},
    });

    this.dataService.getCategories().subscribe((response) => {
      this.categories = response;
    });
  }

  addUser(): void {
    this.isOpen = true;
  }
  removeOverlay(): void {
    this.isOpen = false;
    this.AddCategory = false;
    this.EditCategory = false;
    this.isCategoryUsed = '';
  }
  navigateToRegister(type: string): void {
   
    this.router.navigate(['/registration'], { state: { type: type } });
  }

  delete = false;
  userId!: string;
  showDeleteWindow(id: string): void {
    this.delete = true;
    this.userId = id;
  }
  removeWindow(): void {
    this.delete = false;
  }
  deleteUser(): void {
    this.dataService.deleteUser(this.userId).subscribe(() => {
      localStorage.removeItem('pinned')
      window.location.reload();
    });
  }

  Role!: string;
  editUser(id: string | number): void {
    if (history.state.params ==='ექიმები') {
      this.Role = 'ექიმი';
    }
    this.router.navigate([`/edituser/${id}`], {
      state: { id: id, type: this.Role },
    });
  }

  showAddCategory(): void {
    this.inputValue = '';
    this.AddCategory = true;
    this.isOpen = true;
    this.EditCategory = false;
  }

  handleChange(event: any): void {
    this.inputValue = event.target.value;
  }
  addCategory(): void {
    const formData = {
      category: this.inputValue,
    };
    if (this.inputValue) {
      this.dataService.addCategory(formData).subscribe({
        next: (response) => {
          window.location.reload();
        },
        error: (error) => {
          console.error('post request failed:', error);
        },
      });
    }
  }

  deleteCategory(id: string, category: string): void {
    const filteredCategory = this.users.filter(
      (user) => user.category === category
    );
    if (filteredCategory.length > 0) {
      this.isOpen = true;
      this.isCategoryUsed = this.translate.instant('categoryused');
    } else {
      this.dataService.deleteCategory(id).subscribe(() => {
        window.location.reload();
      });
    }
  }

  showEditCategory(category: string, id: number): void {
    this.EditCategory = true;
    this.AddCategory = false;
    this.isOpen = true;
    this.inputValue = category;
    this.categoryId = id;
  }
  data!: any;
  editCategory(): void {
    this.data = { category: this.inputValue };
    this.dataService.editCategory(this.data, this.categoryId).subscribe(() => {
      window.location.reload();
    });
  }

  downloadFile(cv: string): void {
    this.dataService.downloadFile(cv).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], {
          type:
            response.type === 'application/pdf'
              ? 'application/pdf'
              : 'application/octet-stream',
        });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (error) => {
        console.error('Download failed:', error);
      },
    });
  }
}
