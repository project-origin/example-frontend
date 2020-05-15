import { Component, OnInit } from '@angular/core';
import { DisclosureService, GetDisclosureResponse, GetDisclosureRequest, DisclosureDataSeries } from 'src/app/services/disclosures/disclosures.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-view-disclosure',
  templateUrl: './view-disclosure.component.html',
  styleUrls: ['./view-disclosure.component.css']
})
export class ViewDisclosureComponent implements OnInit {


  labels: string[] = [];
  data: DisclosureDataSeries[] = [];

  loading: boolean = false;
  exists: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private disclosureService: DisclosureService,
  ) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.getDisclosure(params.get('disclosureId'));
    })
  }


  getDisclosure(id: string) {
    let request = new GetDisclosureRequest({id: id});

    this.labels = [];
    this.data = [];
    this.loading = true;
    this.disclosureService
      .getDisclosure(request)
      .subscribe(this.onGetDisclosureComplete.bind(this));
  }

  onGetDisclosureComplete(response: GetDisclosureResponse) {
    this.loading = false;
    this.exists = response.success;
    if(response.success) {
      this.labels = response.labels;
      this.data = response.data;
    }
  }

}
