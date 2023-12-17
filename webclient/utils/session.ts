import { getServerSession } from "next-auth";

export default async function SessionDetails()
{
    const session = getServerSession();
    console.log(session);
}