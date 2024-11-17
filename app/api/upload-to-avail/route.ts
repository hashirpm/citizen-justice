import { GRAPH_QUERY_URL } from "@/components/lib/const";
import { submitAndRecieveData } from "@/lib/avail";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    let res = await axios.post(GRAPH_QUERY_URL, {
        query: `
            {
                events{
                        id
                        description
                        evidences{
                            evidenceHash
                    }   
                }
            }`
    })
    let data = JSON.stringify(res.data.data.events)
    console.log("Submitting data:", data)
    await submitAndRecieveData(data)

    return NextResponse.json({ message: "Data submitted to the chain" });
}