import { NextResponse, connection } from "next/server";
import { getPokemonData } from "../../lib/pokemon"

function dailyID(date: string): number {
    let hash = 0;
    for (const ch of date) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    return (hash % 1025) + 1;
}

export async function GET() {
    await connection();

    const today = new Date().toISOString().slice(0, 10);
    const pokemon = await getPokemonData(dailyID(today));
    return NextResponse.json({ date: today, pokemon });
}