import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, map } from 'rxjs';
import { Person } from '../shared/search.model';

@Injectable({
    providedIn: 'root',
})
export class DetailService {
    private http = inject(HttpClient);

    private _selectedPerson$ = new BehaviorSubject<Person | undefined>(
        undefined
    ); // keep behavior subject private
    selectedPerson$ = this._selectedPerson$.asObservable(); // expose data via public observable

    /**
     * CALLOUT: the status could be enhanced to include status types like 'info' and 'error'
     * The the status could be used to indicate "Loading..." status as well as error messages
     */
    private _status$ = new BehaviorSubject<string>('');
    status$ = this._status$.asObservable();

    /**
     * Fetch a Person from the API and update the selectedPerson Observable
     * If an error occurs, it will set the selectedPerson to undefined and set the status Observable
     *
     * CALLOUT: To support the detail display we add sortedQuotes to the Person object
     * - Use the "liked count" key and sort numerically
     * - Map to an array of tuples with key value pairs
     *   this is to preserve sorted key (i.e., likes) order
     * - This functionality could have been done in a pipe instead
     *
     * @param id
     */
    fetchPerson(id: string): void {
        const url = `http://localhost:5010/details/${id}`;

        this._status$.next('');
        this.http
            .get<Person>(url)
            .pipe(
                catchError((httpErrorResponse: HttpErrorResponse) => {
                    this._selectedPerson$.next(undefined);
                    const errorMessage: string =
                        httpErrorResponse.error.error ||
                        httpErrorResponse.error.statusText ||
                        'Unknown Error';
                    this._status$.next(errorMessage);
                    return EMPTY;
                }),
                map((person) => {
                    const sortedQuotes = Object.keys(person.quotes)
                        .sort((a, b) => Number(b) - Number(a))
                        .map(
                            (quoteKey) =>
                                [quoteKey, person.quotes[quoteKey]] as [
                                    string,
                                    string[]
                                ]
                        );
                    return { ...person, sortedQuotes };
                })
            )
            .subscribe((person) => this._selectedPerson$.next(person));
    }
}
