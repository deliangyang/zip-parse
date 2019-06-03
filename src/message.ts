import {sheetsMap} from "./sheet-map";

export class Message {
    index: number
    message: string

    public static parse(container: string,
                        index: number, message: string): string {
        let configName = sheetsMap[container]['name'].replace(
            '【仅开发用】', '');
        return [configName, index + '行', message].join(' ')
    }
}