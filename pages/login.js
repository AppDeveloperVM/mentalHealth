import { Link } from '@chakra-ui/react'

const registerUser = event => {
    event.preventDefault() // don't redirect the page
    // where we'll add our form logic
  }

const Login = () => {
    return (
        <div>
        <form action="/login" method="POST">
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required/>
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required/>
            </div>
            <button type="submit">Login</button>
        </form>
        <Link href="/register">Register</Link>
        </div>
    )
}

export default Login