export type FavoriteColor = 'blue' | 'red' | 'green' | null;
export type Quotes = { [key: string]: string[] };

export type Person = {
    id: number;
    name: string;
    favorite_color: FavoriteColor;
    quotes: Quotes;
    sortedQuotes?: [string, string[]][]; // array of key value tuples used to preserve sort order
};
export type QueryParams = {
    term: string | null;
    color: FavoriteColor;
};
