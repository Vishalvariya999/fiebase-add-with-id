import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faPen,faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { StudentServicesService } from 'src/app/shared/services/student-services.service';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss']
})
export class StudentDetailsComponent implements OnInit {

  public studentForm!: FormGroup;
  public studentsData: any;
  public faPen=faPen;
  public faTrash=faTrash; 
  constructor(
    private studentServicesService: StudentServicesService,
    private fb: FormBuilder,
    private toastrService: ToastrService
  ) {
    this.formValidation()
  }

  ngOnInit(): void {
    this.getStudent()
  }

  formValidation() {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      course: ['', Validators.required]
    })
  }

  get frmControl(){
    return this.studentForm.controls;
  }

  onSubmit() {
    if (this.studentForm.invalid) {
      this.toastrService.error("Fill all details...", 'Error');
      return
    }
    let data = {
      ...this.studentForm.value
    }
    this.studentServicesService.addStudent(data).then((res: any) => {
      const temp = {
        id: res.id,
        ...data
      }
      this.studentServicesService.updateOnaddStudent(temp).then((res: any) => {
        console.log('res :>> ', res);
        this.toastrService.success("Data insert successfully", 'Success');
        this.studentForm.reset()
      }).catch((err: any) => {
        console.log('err :>> ', err);
        this.toastrService.error(err.message, 'Error');
      })
    }).catch((err: any) => {
      this.toastrService.error(err.message, 'Error');
    })
    console.log('this.studentForm.value :>> ', this.studentForm.value);
  }

  getStudent() {
    this.studentServicesService.getStudentData().subscribe((res: any) => {
      console.log('res :>> ', res);
      this.studentsData = res.map((data: any) => {
        const data1 = {
          id: data.payload.doc.id,
          ...data.payload.doc.data()
        }
        return data1;
      })
      console.log('this.studentsData :>> ', this.studentsData);
    })
  }

  onUpdate(data: any) {
    console.log('data :>> ', data);
  }

  onDelete(id: string) {
    this.studentServicesService.deleteStudent(id).then((res: any) => {
      console.log('res :>> ', res);
      this.toastrService.success("Data delete succesfully", 'Success');
    }).catch((err: any) => {
      console.log('err :>> ', err);
      this.toastrService.error(err.message, 'Error');
    })
  }
}
