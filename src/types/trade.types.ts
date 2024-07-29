export namespace TradeEnums {

    export type Positions = 'Long' | 'Short'
    export type Tickers = 'BTC/USDT' | 'ETH/USDT'

    export type Trends =
        'Up' | 'Down'

    export type Orders =
        'Limit' | 'Market'

    export type Risks = 0.5 | 1 | 2 | 3

    export enum Results {
        Success = 'Success',
        Failure = 'Failure',
        Process = 'Process',
        PartiallyClosed = 'PartiallyClosed'
    }

    export enum Scenarios {
        First = 'First', Second = 'Second', Third = 'Third', Stop = 'Stop'
    }
}
