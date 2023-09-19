import Link from "next/link";
import '../styles/globals.scss'
const NotFound = ()=>{
    return (
        <div className="not_found">
            <h1>Opp....</h1>
            <h2>This page cannot be found :(((</h2>
            <p>Go back to the <Link href="/">HomePage</Link></p>
        </div>
    )
}
export default NotFound;