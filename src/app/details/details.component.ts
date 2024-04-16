import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailService } from './detail.service';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
    protected detailService = inject(DetailService);
    private route = inject(ActivatedRoute);

    ngOnInit(): void {
        this.detailService.fetchPerson(this.route.snapshot.paramMap.get('id'));
    }
}
