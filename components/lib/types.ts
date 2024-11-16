export type User = {
    acceptedSubmissions: string;
    id: string;
    isVerified: boolean;
    reputationPoints: string;
    totalSubmissions: string;
    attestationId: string | null;
    txHash: string;
    createdEvents: Event[];
    evidences: Evidence[];
};

export type Event = {
    description: string;
    id: string;
    isActive: string;
    location: string;
    timestamp: string;
    txHash: string;
    categoryIds: Category[];
    evidences: Evidence[];
    creator: User;
};

export type Evidence = {
    evidenceHash: string;
    geoLocation: string;
    hasValidated: string;
    id: string;
    timestamp: string;
    txHash: string;
};

export type Category = {
    id: string;
    name: string;
};
