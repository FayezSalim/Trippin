export type schemaInfo<T> = {
    [key in keyof T]?: {
        type: any;
        required?: (string | true)[] | boolean;
        unique?: boolean;
        default?: any;
        match?: (string | RegExp)[];
        primaryKey?: boolean;
        autoIncrement?: boolean;
        field?: string
    }
}
