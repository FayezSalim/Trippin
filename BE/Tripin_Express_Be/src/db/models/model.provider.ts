export interface ModelProvider<T> {
    create(data: T): Promise<T>;
    findOne(data: Partial<T>, fields?: StringKeys<T>): Promise<T>
}

export type StringKeys<T> = Array<{ [K in keyof T]: K extends string ? K : never }>; //fix type
