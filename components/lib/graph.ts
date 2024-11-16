import axios from 'axios';
import { GRAPH_QUERY_URL } from './const';
import { User } from './types';

export const getUserDetails = async (identityHash: string | undefined | null) => {
    console.log('identityHash: ', identityHash);
    const response = await axios.post(GRAPH_QUERY_URL, {
        query: `
            query getUser($id: String!) {
                users(where: {identityHash: $id}) {
                    acceptedSubmissions
                    id
                    identityHash
                    isVerified
                    reputationPoints
                    totalSubmissions
                    txHash
                    createdEvents {
                        description
                        id
                        isActive
                        location
                        timestamp
                        txHash
                    }
                    evidences {
                        evidenceHash
                        geoLocation
                        hasValidated
                        id
                        timestamp
                        txHash
                    }
                }
            }
            `,
        variables: {
            id: identityHash?.toLowerCase(),
        },

    });
    console.log('response :', response);
    return response.data.data;
}


export const getUsersByReputation = async (): Promise<User[]> => {
    const response = await axios.post(GRAPH_QUERY_URL, {
        query: `
            query {
                users(orderBy: reputationPoints, orderDirection: desc) {
                    identityHash
                    reputationPoints
                    totalSubmissions
                    acceptedSubmissions
                    isVerified
                }
            }
            `,
    });
    return response.data.data.users;
}