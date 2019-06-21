import {Hash} from "./excel2json";

export type Target = 'app' | 'webview' | 'explorer'

export interface Link {
    url: string
    target: Target
    data: Hash
}

