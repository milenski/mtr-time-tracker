import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbModal, NgbActiveModal, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import { RootService } from './../core/root.service';
import { ProjectService } from './project.service';
import { TimeReportService } from './time-report.service';

import { User } from './../models/user.model';
import { TimeReport } from './../models/time-report.model';
import { Project } from './../models/project.model';

@Component({
  templateUrl: './add-time-report.component.html',
  providers: [ NgbDatepickerConfig ]
})
export class AddTimeReportComponent implements OnInit {

  addTimeReportForm: FormGroup;
  user: User;
  projects: Array<Project> = [];

  // String messages containing the form submission results
  addTimeReportFormSuccessMessage: string;
  addTimeReportFormErrorMessage: string;

  constructor(
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private rootService: RootService,
    private projectService: ProjectService,
    private timeReportsService: TimeReportService,
    private datepickerConfig: NgbDatepickerConfig) {

    this.createAddTimeReportForm();
    this.setupDatepickerConfigs();
  }

  /**
   * Build the Add Time Report form and setup some validation rules
   */
  createAddTimeReportForm() {

    this.addTimeReportForm = this.fb.group({
      project: [0, Validators.required],
      name: ['', Validators.required],
      hours: ['', [Validators.required, Validators.pattern(/(|)(\d|\d{1}:\d{2}|\d{2}:\d{2})/)]],
      description: '',
      date: ['', Validators.required],
    });
  }

  fillAddTimeReportsForm() {
    let dateNow: moment.Moment = moment();
    this.addTimeReportForm.patchValue({
      project: 0,
      date: { year: dateNow.year(), month: dateNow.month()+1, day: dateNow.date()}
    });
  }

  ngOnInit() {
    this.user = this.rootService.user;

    this.projectService.getProjects(this.user)
                        .subscribe(
                          projects => this.projects = projects,
                          error => console.log(error)
                        );

    this.fillAddTimeReportsForm();
  }

  onAddTimeReportFormSubmit() {
    this.addTimeReportFormErrorMessage = '';
    let timeReport: TimeReport = this.prepareSaveTimeReport(this.user);

    this.timeReportsService.create(this.user, timeReport)
                    .subscribe(
                      response => {
                        console.log(response);
                        if (response.id) {
                          this.addTimeReportFormSuccessMessage = 'Your Time Report has been successfully added.';
                          setTimeout(() => this.addTimeReportFormSuccessMessage = '', 3000);

                          this.addTimeReportForm.reset();
                          this.fillAddTimeReportsForm();
                        }
                        else {
                          this.addTimeReportFormErrorMessage = 'An error has occured while saving your Time Report. PLease try again or contact the developers team.';
                        }
                      },
                      error => {
                        console.log(error);
                        this.addTimeReportFormErrorMessage = error
                      }
                    );
  }

    /**
   * Get the entered data in the form and serialize it as a TimeReport object, ready to pass it to the TimeReportsService
   * Returns new `User` object containing a combination of original user value(s) and deep copies of changed form model values
   * @param  {User} user
   * @return {TimeReport}
   */
  prepareSaveTimeReport(user: User): TimeReport {
    const formModel = this.addTimeReportForm.value;

    var seconds: number = 0;
    if (moment.duration(formModel.hours).asSeconds()) {
      seconds = moment.duration(formModel.hours).asSeconds();
    } else {
      seconds = moment.duration({'hours': formModel.hours}).asSeconds();
    }

    console.log(seconds);

    var date = formModel.date.year + '-' + formModel.date.month + '-' + formModel.date.day;

    const saveTimeReport: TimeReport = {
      project: formModel.project as number,
      profile: user.id as number,

      name: formModel.name as string,
      seconds: seconds as number,
      description: formModel.description as string,
      date: date as string,
    };

    return saveTimeReport;
  }

  setupDatepickerConfigs() {
    // Setup some datepicker configs
    let dateNow: moment.Moment = moment();
    this.datepickerConfig.maxDate = {
      year: dateNow.year(),
      month: dateNow.month() + 1,
      day: dateNow.date(),
    };
  }

}
