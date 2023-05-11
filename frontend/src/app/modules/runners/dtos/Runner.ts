export interface Runner {
    id: string;
    username: string;
    state: string | null;
    lastStateChange: number;
    round: number;
    timestamp: number;
    station: string | null;
}
