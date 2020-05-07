import { Component, OnInit } from '@angular/core';
import { Disclosure } from 'src/app/services/disclosures/models';
import { DisclosureService, GetDisclosureListResponse, DeleteDisclosureRequest, DeleteDisclosureResponse } from 'src/app/services/disclosures/disclosures.service';


@Component({
  selector: 'app-disclosure',
  templateUrl: './disclosure.component.html',
  styleUrls: ['./disclosure.component.css']
})
export class DisclosureComponent implements OnInit {


  loading: boolean = false;
  disclosures: Disclosure[] = [];


  constructor(private disclosureService: DisclosureService) { }


  ngOnInit(): void {
    this.getDisclosureList();
  }


  getDisclosureList() {
    this.loading = true;
    this.disclosureService
      .getDisclosureList()
      .subscribe(this.onGetDisclosureListComplete.bind(this));
  }

  onGetDisclosureListComplete(response: GetDisclosureListResponse) {
    this.loading = false;
    if(response.success) {
      this.disclosures = response.disclosures;
    }
  }


  deleteDisclosure(disclosure: Disclosure) {
    this.disclosureService
      .deleteDisclosure(new DeleteDisclosureRequest({id: disclosure.id}))
      .subscribe(this.onDeleteDisclosureComplete.bind(this));

  }

  onDeleteDisclosureComplete(response: DeleteDisclosureResponse) {
    this.getDisclosureList();
  }

}
