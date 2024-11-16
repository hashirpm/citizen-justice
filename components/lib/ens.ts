import axios from "axios";

const ENS_Subgraph_URL = `https://gateway.thegraph.com/api/770c4de591ca911452f65c8c9112210c/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH`;

export const getEnsFromAddress = async (address: string): Promise<string> => {
    const response = await axios.post(ENS_Subgraph_URL, {
        query: `
            query {
                domains(where: {owner: "${address.toLowerCase()}"}) {
                    name
                }
            }
            `,
    });
    return response.data.data.domains[0].name;
}

export const getAddressFromEns = async (ens: string): Promise<string> => {
    const response = await axios.post(ENS_Subgraph_URL, {
        query: `
            query {
                domains(where: {name: "${ens}"}) {
                    owner
                }
            }
            `,
    });
    return response.data.data.domains[0].owner;
}

export const getEnsOrAddress = (address: string | null | undefined): Promise<string> => {
    if (!address) {
        return Promise.resolve("");
    }
    return getEnsFromAddress(address).catch(() => address.slice(0, 6) + "..." + address.slice(-4));
}