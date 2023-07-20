import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class StudentServicesService implements OnInit {

  constructor(
    private angularFirestore: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.getStudentData()
  }

  getStudentData() {
    return this.angularFirestore.collection('student-details').snapshotChanges()
  }

  addStudent(data: any) {
    return this.angularFirestore.collection('student-details').add(data)
  }

  updateOnaddStudent(data: any) {
    return this.angularFirestore.collection('student-details').doc(data.id).set(data)
  }

  deleteStudent(id: string) {
    return this.angularFirestore.collection('student-details').doc(id).delete()
  }

}
