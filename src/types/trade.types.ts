export namespace TradeEnums {
    export enum Positions {
        long = 'Long',
        short = 'Short'
    }

    export enum Trends {
        up = 'Up', down = 'Down'
    }

    export enum Orders {
        limit = 'Limit', market = 'Market'
    }

    export type Risks = 0.5 | 1 | 2 | 3

    export enum Results {
        Success = 'Success',
        Failure = 'Failure',
        Process = 'Process',
        PartiallyClosed = 'PartiallyClosed'
    }

    export type Takes = 'first' | 'second' | 'third'
}