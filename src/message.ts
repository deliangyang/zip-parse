
export class Message {
    index: number
    message: string

    public static parse(container: string, index: number, message: string): string {
        return [container, index, message].join(' ')
    }
}