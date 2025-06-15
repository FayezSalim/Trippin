/**
 * @api
 */
export interface TagData {
    name: string,
    icon: string
}


export interface Tag {
    tagData: TagData,
    key: string,
    isVisible: boolean,
    top?: string,
    left?: string
}