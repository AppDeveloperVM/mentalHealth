import React, { useState, useEffect } from 'react'
import { useRouter, Loading } from 'next/router';
import { useSession } from "next-auth/react"

import { getSession } from "next-auth/react"


const Page = ( req, res ) => {
    const session = getSession({ req })

    if (session === "authenticated") {
        return <p>Signed in as {session.user.email}</p>
    }

    return (
        <div>
        <h1>Index</h1>
        <div>Hey invitate</div>
        </div>
    )
}


export default Page