import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SearchService } from './search.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
    protected searchService = inject(SearchService);
    protected searchForm: FormGroup;
    protected colorOptions: string[] = ['blue', 'red', 'green'];

    ngOnInit(): void {
        this.searchForm = new FormGroup(
            {
                term: new FormControl(null),
                color: new FormControl(''),
            },
            { validators: [this.oneOrTheOtherFieldValidation] }
        );


        /**
         * CALLOUT: I originally implemented a code to reset search results, but the mockup indicates "Back to search results" so I commented out the reset
         * TODO: Consider saving searchForm values so we can restore the form when we return to the search results
         */
        // this.searchService.reset();
    }

    /**
     * Validates the for to check if at least one parameter is defined
     * @param form to validate
     * @returns validation error if no search parameters are set otherwise if returns null to indicate it is valid
     */
    oneOrTheOtherFieldValidation(form: FormGroup) {
        const someFieldIsSet = Object.values(form.controls).some(
            (formControl) => formControl.value
        );
        if (someFieldIsSet) {
            return null;
        }
        return { oneOrTheOtherFieldRequired: true };
    }

    /**
     * Uses the search service to fetch people from the API using the search form
     */
    onSearch() {
        this.searchService.fetchPeople(this.searchForm.value);
    }
}
