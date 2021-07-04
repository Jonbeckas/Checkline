export interface Runner {
    userId: string;
    loginName: string;
    state: string;
    lastStateChange: number;
    round: number;
    timestamp: number;
}
