import { MiniKit } from "@worldcoin/minikit-js"
import ABI from '../../contract/ABI.json'
import { CONTRACT_ADDRESS } from "./const"

export const verifyUser = async (identityHash: string) => {
    console.log('identityHash: ', identityHash)
    const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
            {
                address: CONTRACT_ADDRESS,
                abi: ABI,
                functionName: 'verifyUser',
                args: [identityHash],
            },
        ],
    })
    console.log('commandPayload', commandPayload)
    console.log('finalPayload', finalPayload)
    return { commandPayload, finalPayload }
}

export const createCategory = async (name: string, description: string) => {
    const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
            {
                address: CONTRACT_ADDRESS,
                abi: ABI,
                functionName: 'createCategory',
                args: [name, description],
            },
        ],
    })
    return { commandPayload, finalPayload }
}

export const createEvent = async (description: string, location: string, categoryIds: number[]) => {
    const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
            {
                address: CONTRACT_ADDRESS,
                abi: [{
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_description",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_location",
                            "type": "string"
                        }
                    ],
                    "name": "createEvent",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }],
                functionName: 'createEvent',
                args: [description, location],
            },
        ],
    })
    console.log('commandPayload', commandPayload)
    console.log('finalPayload', finalPayload)
    return { commandPayload, finalPayload }
}

export const deactivateEvent = async (eventId: number) => {
    const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
            {
                address: CONTRACT_ADDRESS,
                abi: ABI,
                functionName: 'deactivateEvent',
                args: [eventId],
            },
        ],
    })
    return { commandPayload, finalPayload }
}

export const validateEvidence = async (evidenceId: number, categoryId: number, isValid: boolean) => {
    const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
            {
                address: CONTRACT_ADDRESS,
                abi: ABI,
                functionName: 'validateEvidence',
                args: [evidenceId, categoryId, isValid],
            },
        ],
    })
    return { commandPayload, finalPayload }
}

export const submitEvidence = async (evidenceHash: string, geoLocation: string, categoryIds: number[], eventId: number, metadata: string) => {
    const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
            {
                address: CONTRACT_ADDRESS,
                abi: [{
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_evidenceHash",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_geoLocation",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_eventId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "_metadata",
                            "type": "string"
                        }
                    ],
                    "name": "submitEvidence",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }],
                functionName: 'submitEvidence',
                args: [evidenceHash, geoLocation, eventId, metadata],
            },
        ],
    })
    console.log('commandPayload', commandPayload)
    console.log('finalPayload', finalPayload)
    return { commandPayload, finalPayload }
}