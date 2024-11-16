import { MiniKit } from "@worldcoin/minikit-js"
import ABI from '../../contract/ABI.json'
import { CONTRACT_ADDRESS } from "./const"

export const verifyUser = async (identityHash: string) => {
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
}

export const createEvent = async (description: string, location: string, categoryIds: number[]) => {
    const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
            {
                address: CONTRACT_ADDRESS,
                abi: ABI,
                functionName: 'createEvent',
                args: [description, location, categoryIds],
            },
        ],
    })
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
}

export const submitEvidence = async (evidenceHash: string, geoLocation: string, categoryIds: number[], eventId: number, metadata: string) => {
    const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
            {
                address: CONTRACT_ADDRESS,
                abi: ABI,
                functionName: 'submitEvidence',
                args: [evidenceHash, geoLocation, categoryIds, eventId, metadata],
            },
        ],
    })
}
