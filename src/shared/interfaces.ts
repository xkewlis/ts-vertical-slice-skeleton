export interface Sorting {
    key: string,
    order: 'ASC' | 'DESC'
}

export interface Migration {
    up(): Promise<void>;
    down?(): Promise<void>;
}

export interface MigrationSeederData {
    name: string;
    abbreviation: string;
    migration: new () => Migration;
}
