'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default function AuthTest() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [user, setUser] = useState<any>(null)

    async function signUp() {
        setLoading(true)
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                }
            })

            if (error) throw error

            setMessage(`✅ Account created! Check your email (${email}) for confirmation link.`)
            console.log('SignUp success:', data)
        } catch (error: any) {
            setMessage(`❌ Error: ${error.message}`)
        }
        setLoading(false)
    }

    async function signIn() {
        setLoading(true)
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            setUser(data.user)
            setMessage(`✅ Signed in as ${data.user?.email}`)

            // Check profile and role
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user?.id)
                .single()

            console.log('User profile:', profile)
        } catch (error: any) {
            setMessage(`❌ Error: ${error.message}`)
        }
        setLoading(false)
    }

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (!error) {
            setUser(null)
            setMessage('✅ Signed out successfully')
        }
    }

    async function makeAdmin() {
        if (!user) {
            setMessage('❌ Please sign in first')
            return
        }

        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', user.id)
                .select()

            if (error) throw error

            setMessage('✅ User role updated to admin!')
            console.log('Updated profile:', data)
        } catch (error: any) {
            setMessage(`❌ Error updating role: ${error.message}`)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    🔐 Authentication Test
                </h1>

                <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">

                    {!user ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Password (min 6 characters)"
                                />
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={signUp}
                                    disabled={loading || !email || !password || !fullName}
                                    className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? '⏳' : '✍️'} Sign Up
                                </button>
                                <button
                                    onClick={signIn}
                                    disabled={loading || !email || !password}
                                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? '⏳' : '🔑'} Sign In
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-green-700 mb-2">
                                    Welcome! 👋
                                </h3>
                                <p className="text-gray-600">
                                    Signed in as: <strong>{user.email}</strong>
                                </p>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={makeAdmin}
                                    className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                >
                                    👑 Make Admin
                                </button>
                                <button
                                    onClick={signOut}
                                    className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    🚪 Sign Out
                                </button>
                            </div>
                        </>
                    )}

                    {message && (
                        <div className={`p-3 rounded-md text-sm ${message.includes('❌') ? 'bg-red-50 text-red-700 border border-red-200' :
                                'bg-green-50 text-green-700 border border-green-200'
                            }`}>
                            {message}
                        </div>
                    )}

                </div>

                <div className="mt-6 text-center">
                    <a
                        href="/"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        ← Back to Home
                    </a>
                </div>

                <div className="mt-4 text-xs text-gray-500 bg-gray-100 p-3 rounded">
                    <p><strong>Instructions:</strong></p>
                    <p>1. Sign up with your email to create the first admin account</p>
                    <p>2. Check your email for confirmation link (click it)</p>
                    <p>3. Sign in with your credentials</p>
                    <p>4. Click "Make Admin" to grant admin privileges</p>
                </div>
            </div>
        </div>
    )
}