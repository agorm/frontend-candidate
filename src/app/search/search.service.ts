import {
    HttpClient,
    HttpErrorResponse,
    HttpParams,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, tap } from 'rxjs';
import { Person, QueryParams } from '../shared/search.model';

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    private http = inject(HttpClient);

    private _people$ = new BehaviorSubject<Person[]>([]); // keep behavior subject private
    people$ = this._people$.asObservable(); // expose data via public observable

    /**
     * CALLOUT: the status could be enhanced to include status types like 'info' and 'error'
     * The the status could be used to indicate "Loading..." status as well as error messages
     */
    private _status$ = new BehaviorSubject<string>(''); // keep behavior subject private
    status$ = this._status$.asObservable(); // expose data via public observable

    /**
     * Fetches a list of Persons from the API using the provided QueryParams and updates the Observable
     * If an error occurs, it will set the list to an empty array and set the status Observable
     * @param searchQuery
     */
    fetchPeople(searchQuery: QueryParams) {
        let params = new HttpParams();
        if (searchQuery.term) {
            params = params.append('term', searchQuery.term);
        }
        if (searchQuery.color) {
            params = params.append('color', searchQuery.color);
        }

        this._status$.next('');
        this.http
            .get<{ matches: Person[] }>('http://localhost:5010/search', {
                params,
            })
            .pipe(
                catchError((httpErrorResponse: HttpErrorResponse) => {
                    this._people$.next([]);
                    const errorMessage: string =
                        httpErrorResponse.error.error ||
                        httpErrorResponse.error.statusText ||
                        'Unknown Error';
                    this._status$.next(
                        `Error fetching People: ${errorMessage}`
                    );
                    return EMPTY;
                }),
                tap((response) => {
                    const status =
                        response.matches.length === 0
                            ? 'No People Found'
                            : 'Search Results';
                    this._status$.next(status);
                })
            )
            .subscribe((response) => this._people$.next(response.matches));
    }

    /**
     * Resets observables to the default state
     */
    reset() {
        this._people$.next([]);
        this._status$.next('Search for People');
    }
}
