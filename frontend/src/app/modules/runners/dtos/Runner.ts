export interface Runner {
    id: string;
    username: string;
    state: string | null;
    lastStateChange: Date;
    round: number;
    timestamp: Date;
    station: string | null;
}
