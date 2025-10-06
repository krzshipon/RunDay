'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default function SupabaseTest() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')
    const [tables, setTables] = useState<string[]>([])

    useEffect(() => {
        async function testConnection() {
            try {
                console.log('Testing Supabase connection...')
                console.log('URL:', supabaseUrl)
                console.log('Key length:', supabaseKey?.length)

                // Test 1: Basic connection with profiles table
                const { data: profilesTest, error: profilesError } = await supabase
                    .from('profiles')
                    .select('*')
                    .limit(1)

                console.log('Profiles test result:', { data: profilesTest, error: profilesError })

                const availableTables = []
                if (!profilesError) {
                    availableTables.push('profiles')
                }

                // Test 2: Events table
                const { data: eventsTest, error: eventsError } = await supabase
                    .from('events')
                    .select('*')
                    .limit(1)

                if (!eventsError) {
                    availableTables.push('events')
                }

                // Test 3: Registrations table
                const { data: registrationsTest, error: registrationsError } = await supabase
                    .from('registrations')
                    .select('*')
                    .limit(1)

                if (!registrationsError) {
                    availableTables.push('registrations')
                }

                if (availableTables.length > 0) {
                    setTables(availableTables)
                    setStatus('success')
                    setMessage(`✅ Connection successful! Found ${availableTables.length} tables.`)
                } else {
                    throw new Error('No tables found - check database setup')
                }

            } catch (error) {
                console.error('Connection test error:', error)
                setStatus('error')
                setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
            }
        }

        testConnection()
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
            <div className="max-w-lg mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    🧪 Supabase Connection Test
                </h1>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="mb-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status === 'loading' ? 'bg-yellow-100 text-yellow-800' :
                                status === 'success' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                            }`}>
                            {status === 'loading' && '🔄 Testing...'}
                            {status === 'success' && '✅ Connected'}
                            {status === 'error' && '❌ Failed'}
                        </div>
                    </div>

                    <p className="text-gray-700 mb-4">{message}</p>

                    {status === 'success' && (
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Available Tables:</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
                                {tables.map(table => (
                                    <li key={table} className="capitalize">{table}</li>
                                ))}
                            </ul>
                            <div className="text-sm text-green-700 bg-green-50 p-3 rounded">
                                🎉 Database setup complete! Ready for Phase 2.
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="mt-4 p-3 bg-red-50 rounded border-l-4 border-red-400">
                            <p className="text-sm text-red-700">
                                Check your .env.local file and ensure Supabase credentials are correct.
                            </p>
                            <details className="mt-2">
                                <summary className="cursor-pointer text-xs">Environment Check</summary>
                                <pre className="text-xs mt-1 bg-gray-100 p-2 rounded">
                                    URL: {supabaseUrl || 'Missing'}{'\n'}
                                    Key: {supabaseKey ? 'Present' : 'Missing'}
                                </pre>
                            </details>
                        </div>
                    )}
                </div>

                <div className="mt-6 text-center space-x-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        🔄 Test Again
                    </button>
                    <a
                        href="/"
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors inline-block"
                    >
                        ← Back to Home
                    </a>
                </div>
            </div>
        </div>
    )
}