import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const AuthContext = React.createContext(null)

export function AuthProvider({ children, authCheckUrl = '/auth/auth-check' }){
    const [ user, setUser ] = React.useState(null)
    const [ loadiing, setLoading ] = React.useState(true)

    React.useEffect(()=>{
        fetch(authCheckUrl)
            .then((res)=>res.json())
            .then((data) => {
                if (data.authenticated) {
                    setUser(data)
                }
            })
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [authCheckUrl])

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return React.useContext(AuthContext)
}

export function ProtectedRoute({
    redirectTo = '/login'
}){
    const { user, loading } = useAuth();

    if (loading) return <div>Loading authenticated...</div>
    if (!user) return <Navigate to={redirectTo} replace />

    return <Outlet />
}