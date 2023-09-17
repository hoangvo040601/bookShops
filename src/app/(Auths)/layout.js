
import { RootStyleRegistry } from '../root-style-registry'

export default function AuthLayout({ children }) {
    console.log('b')
    return (
        <div>
            <RootStyleRegistry>
                {children}
            </RootStyleRegistry>
        </div>
    )
}
