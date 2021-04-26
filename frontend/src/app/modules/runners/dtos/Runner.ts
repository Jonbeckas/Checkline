export interface Runner {
    userId: string;
    loginName: string;
    state: number;
    lastStateChange: number;
    round: number;
    timestamp: number;
}
