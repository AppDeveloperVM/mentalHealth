import { ChakraProvider } from "@chakra-ui/provider";
import theme from '../lib/theme'
import  Layout  from "../components/layouts/main";

import { SessionProvider } from "next-auth/react"

const Website = ({
    Component,
    pageProps: { session, ...pageProps },
    router,}) => {
    return (
        <SessionProvider session={session}>
        <ChakraProvider theme={theme}>
            <Layout router={router}>
                <Component {...pageProps} key={router.route}/>
            </Layout>
        </ChakraProvider>
        </SessionProvider>
    )
}

export default Website