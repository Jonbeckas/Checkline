export interface Runner {
    id: string;
    username: string;
    state: string;
    lastStateChange: number;
    round: number;
    timestamp: number;
    station: string;
}
