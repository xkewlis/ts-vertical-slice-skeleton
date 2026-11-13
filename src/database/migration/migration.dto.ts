export class MigrationDto {
    constructor(
        public name: string,
        public abbreviation: string,
    ){}

    static create(object: { [key: string]: any }): [string[]?, MigrationDto?] {
        const { name, abbreviation } = object;
        const errors: string[] = [];

        if (!name) errors.push("Name is required");
        if (name && typeof name !== 'string') errors.push("Name must be a string");
        if (!abbreviation) errors.push("Abbreviation is required");
        if (abbreviation && typeof abbreviation !== 'string') errors.push("Abbreviation must be a string");

        if (errors.length > 0) return [errors];

        return [undefined, new MigrationDto(
            name,
            abbreviation,
        )];
    }
}
