import axios from "axios";
import { GRAPH_QUERY_URL } from "./const";
import { Event, User } from "./types";

export const getUserDetails = async (
  identityHash: string | undefined | null
) => {
  console.log("identityHash: ", identityHash);
  const response = await axios.post(GRAPH_QUERY_URL, {
    query: `
            query getUser($id: String!) {
                users(where: {identityHash: $id}) {
                    acceptedSubmissions
                    id
                    identityHash
                    attestationId
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
  console.log("response :", response);
  return response.data.data;
};

export const getUsersByReputation = async (): Promise<User[]> => {
  const response = await axios.post(GRAPH_QUERY_URL, {
    query: `
            query {
                users(orderBy: reputationPoints, orderDirection: desc) {
                    id
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
};

export const getAllActiveEvents = async (): Promise<Event[]> => {
  const response = await axios.post(GRAPH_QUERY_URL, {
    query: `
            query {
                events{
                        id
                        description
                        location
                        isActive
                        txHash
                        timestamp
                        category{
                            id
                        }
                        evidences{
                        evidenceHash
                    }
                }
            }
            `,
  });
  return response.data.data.events;
};


export const checkUserExists = async (identityHash: string): Promise<boolean> => {
  const response = await axios.post(GRAPH_QUERY_URL, {
    query: `
            query{
                users( where: {identityHash: "${identityHash.toLowerCase()}"}) {
                    id
                }
            }
            `,
  });
  return response.data.data.users.length > 0;
}